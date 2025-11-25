import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'embed/:encodedUrl',
    loadComponent: () => import('./components/embed/embed.component').then(m => m.EmbedComponent)
  }
];
