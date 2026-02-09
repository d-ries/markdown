import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation, Renderer2, ComponentRef, EnvironmentInjector, createComponent, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService } from '../../services/github.service';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { preprocessMarkdownForQuizzes, getQuizData, clearQuizData } from '../../services/quiz-extension';
import { QuizComponent } from '../quiz/quiz.component';
import { Quiz } from '../../services/quiz-parser.service';

@Component({
  selector: 'app-embed',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './embed.component.html',
  styleUrl: './embed.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbedComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private githubService = inject(GithubService);
  private sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);
  private environmentInjector = inject(EnvironmentInjector);
  private ngZone = inject(NgZone);
  
  htmlContent = signal<SafeHtml | null>(null);
  loading = this.githubService.loading;
  error = this.githubService.error;
  private quizMarkers: { element: HTMLElement; quiz: Quiz }[] = [];

  ngOnInit(): void {
    // Configure marked to use highlight.js
    marked.use(markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch {}
        }
        return hljs.highlightAuto(code).value;
      }
    }));

    const encodedUrl = this.route.snapshot.paramMap.get('encodedUrl');
    
    if (!encodedUrl) {
      this.githubService.error.set('No URL provided');
      return;
    }

    try {
      const githubUrl = atob(encodedUrl);
      this.loadMarkdown(githubUrl);
    } catch {
      this.githubService.error.set('Invalid encoded URL');
    }
  }

  private async loadMarkdown(githubUrl: string): Promise<void> {
    try {
      // Clear previous quiz data
      clearQuizData();
      
      const markdown = await this.githubService.fetchMarkdown(githubUrl);
      
      // Preprocess markdown to extract and store quizzes
      const preprocessed = preprocessMarkdownForQuizzes(markdown);
      const html = await marked.parse(preprocessed);
      
      // Fix relative image URLs to point to GitHub
      const fixedHtml = this.fixImageUrls(html, githubUrl);
      
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixedHtml));
      
      // Delay to allow DOM to render before processing quizzes
      setTimeout(() => {
        this.renderQuizzes();
        this.sendHeight();
      }, 100);
    } catch {
      // Error already handled in service
    }
  }

  private renderQuizzes(): void {
    const quizMarkers = document.querySelectorAll('.quiz-marker');
    console.log(`🔍 Looking for quiz markers... Found: ${quizMarkers.length}`);
    
    if (quizMarkers.length === 0) {
      console.warn('⚠️ No quiz markers found in DOM');
      return;
    }
    
    quizMarkers.forEach((marker: Element, index: number) => {
      this.ngZone.run(() => {
        const htmlElement = marker as HTMLElement;
        const quizId = htmlElement.getAttribute('data-quiz-id');
        
        console.log(`\n▶ Processing marker #${index + 1}, ID: ${quizId}`);
        
        if (!quizId) {
          console.warn('⚠️ Quiz marker has no data-quiz-id');
          return;
        }
        
        try {
          const quizData = getQuizData(quizId);
          
          if (!quizData) {
            console.warn(`⚠️ No quiz data found for ID: ${quizId}`);
            console.log('Available quiz IDs:', Array.from((getQuizData as any).toString().match(/quiz-\d+/g) || []));
            return;
          }
          
          console.log(`✓ Found quiz data for ${quizId}:`, quizData);
          
          // Create a container div for the component
          const container = this.renderer.createElement('div');
          this.renderer.insertBefore(
            htmlElement.parentNode,
            container,
            htmlElement
          );
          this.renderer.removeChild(htmlElement.parentNode, htmlElement);
          
          // Create and render the quiz component using the modern Angular approach
          const componentRef = createComponent(QuizComponent, {
            environmentInjector: this.environmentInjector,
            hostElement: container
          });
          
          componentRef.setInput('quizData', quizData);
          componentRef.changeDetectorRef.detectChanges();
          
          console.log(`✓ Quiz component rendered successfully`);
          
          this.quizMarkers.push({
            element: container,
            quiz: quizData
          });
        } catch (error) {
          console.error('❌ Failed to render quiz:', error);
        }
      });
    });
  }

  private fixImageUrls(html: string, url: string): string {
    let baseUrl: string;
    
    // Check if it's a GitHub URL
    const githubMatch = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
    if (githubMatch) {
      const [, owner, repo, branch, filePath] = githubMatch;
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
      baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${dirPath}`;
    } else {
      // For direct URLs (like GitHub Pages), use the directory of the markdown file
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      pathParts.pop(); // Remove filename
      baseUrl = `${urlObj.origin}${pathParts.join('/')}/`;
    }
    
    // Replace relative image URLs with absolute URLs
    let fixedHtml = html.replace(/<img([^>]*)\ssrc="(?!https?:\/\/)([^"]+)"/g, (match, attrs, src) => {
      const absoluteUrl = src.startsWith('/') 
        ? new URL(src, baseUrl).origin + src
        : baseUrl + src;
      return `<img${attrs} src="${absoluteUrl}"`;
    });
    
    // Add target="_blank" to all links
    fixedHtml = fixedHtml.replace(/<a\s+href=/g, '<a target="_blank" rel="noopener noreferrer" href=');
    
    return fixedHtml;
  }

  ngAfterViewInit(): void {
    this.sendHeight();
    
    // Send height on window resize
    window.addEventListener('resize', () => this.sendHeight());
    
    // Also observe DOM mutations to recalculate height when quizzes change
    const observer = new MutationObserver(() => {
      setTimeout(() => this.sendHeight(), 100);
    });
    
    const articleElement = document.querySelector('article.markdown-body');
    if (articleElement) {
      observer.observe(articleElement, {
        subtree: true,
        childList: true,
        attributes: true
      });
    }
  }

  private sendHeight(): void {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'resize', height }, '*');
  }
}

