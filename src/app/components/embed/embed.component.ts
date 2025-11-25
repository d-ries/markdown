import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService } from '../../services/github.service';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

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
  
  htmlContent = signal<SafeHtml | null>(null);
  loading = this.githubService.loading;
  error = this.githubService.error;

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
      const markdown = await this.githubService.fetchMarkdown(githubUrl);
      const html = await marked.parse(markdown);
      
      // Fix relative image URLs to point to GitHub
      const fixedHtml = this.fixImageUrls(html, githubUrl);
      
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixedHtml));
      setTimeout(() => this.sendHeight(), 100);
    } catch {
      // Error already handled in service
    }
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
    return html.replace(/<img([^>]*)\ssrc="(?!https?:\/\/)([^"]+)"/g, (match, attrs, src) => {
      const absoluteUrl = src.startsWith('/') 
        ? new URL(src, baseUrl).origin + src
        : baseUrl + src;
      return `<img${attrs} src="${absoluteUrl}"`;
    });
  }

  ngAfterViewInit(): void {
    this.sendHeight();
    
    // Send height on window resize
    window.addEventListener('resize', () => this.sendHeight());
  }

  private sendHeight(): void {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'resize', height }, '*');
  }
}

