import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private sanitizer = inject(DomSanitizer);
  
  githubUrl = signal('');
  embedUrl = signal('');
  iframeCode = signal('');
  sanitizedEmbedUrl = signal<SafeResourceUrl | null>(null);
  copied = signal(false);

  generateEmbed(): void {
    const url = this.githubUrl();
    if (!url) return;

    const encodedUrl = btoa(url);
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    const fullEmbedUrl = `${baseUrl}/embed/${encodedUrl}`;
    
    this.embedUrl.set(fullEmbedUrl);
    this.iframeCode.set(`<iframe src="${fullEmbedUrl}" width="100%" height="600" frameborder="0"></iframe>`);
    this.sanitizedEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(fullEmbedUrl));
    this.copied.set(false);
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.iframeCode());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Fallback silent fail
    }
  }
}
