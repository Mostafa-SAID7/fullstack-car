import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/media-dashboard/media-dashboard.component').then(m => m.MediaDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos',
    loadComponent: () => import('./components/video-list/video-list.component').then(m => m.VideoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos/upload',
    loadComponent: () => import('./components/video-upload/video-upload.component').then(m => m.VideoUploadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos/:id',
    loadComponent: () => import('./components/video-player/video-player.component').then(m => m.VideoPlayerComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'podcasts',
    loadComponent: () => import('./components/podcast-list/podcast-list.component').then(m => m.PodcastListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'podcasts/upload',
    loadComponent: () => import('./components/podcast-upload/podcast-upload.component').then(m => m.PodcastUploadComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'podcasts/:id',
    loadComponent: () => import('./components/podcast-player/podcast-player.component').then(m => m.PodcastPlayerComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists',
    loadComponent: () => import('./components/playlist/playlist.component').then(m => m.PlaylistComponent),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }