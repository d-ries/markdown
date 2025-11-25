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

  private fixImageUrls(html: string, githubUrl: string): string {
    // Extract base path from GitHub URL
    // https://github.com/user/repo/blob/branch/path/file.md -> https://raw.githubusercontent.com/user/repo/branch/path/
    const match = githubUrl.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
    if (!match) return html;
    
    const [, owner, repo, branch, filePath] = match;
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${dirPath}`;
    
    // Replace relative image URLs with absolute GitHub raw URLs
    return html.replace(/<img([^>]*)\ssrc="(?!https?:\/\/)([^"]+)"/g, (match, attrs, src) => {
      const absoluteUrl = src.startsWith('/') 
        ? `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${src}`
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

