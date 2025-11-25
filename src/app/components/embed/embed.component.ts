import { Component, inject, signal, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
export class EmbedComponent implements OnInit {
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
    } catch {
      // Error already handled in service
    }
  }
}

