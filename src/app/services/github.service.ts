import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  
  loading = signal(false);
  error = signal<string | null>(null);

  async fetchMarkdown(githubUrl: string): Promise<string> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const apiUrl = this.convertToApiUrl(githubUrl);
      const response = await firstValueFrom(
        this.http.get<{ content: string; encoding: string }>(apiUrl)
      );
      
      // GitHub API returns base64 encoded content with newlines, strip them first
      const content = atob(response.content.replace(/\s/g, ''));
      this.loading.set(false);
      return content;
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to fetch markdown from GitHub';
      this.error.set(errorMsg);
      this.loading.set(false);
      throw new Error(errorMsg);
    }
  }

  private convertToApiUrl(githubUrl: string): string {
    // Convert github.com/user/repo/blob/branch/path
    // to api.github.com/repos/user/repo/contents/path?ref=branch
    // Support both https:// and without protocol
    const match = githubUrl.match(/(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
    if (!match) {
      throw new Error(`Invalid GitHub URL: ${githubUrl}. Expected format: https://github.com/user/repo/blob/branch/file.md`);
    }
    
    const [, owner, repo, branch, path] = match;
    return `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  }
}
