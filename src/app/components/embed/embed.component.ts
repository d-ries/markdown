import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService } from '../../services/github.service';
import { marked } from 'marked';

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
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
      setTimeout(() => this.sendHeight(), 100);
    } catch {
      // Error already handled in service
    }
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

