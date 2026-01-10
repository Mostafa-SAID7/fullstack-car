import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { MediaMainComponent } from './components/media-main/media-main.component';
import { VideoDetailComponent } from './components/video/detail/video-detail.component';
import { VideoUploadComponent } from './components/video/upload/video-upload.component';
import { PodcastDetailComponent } from './components/podcast/detail/podcast-detail.component';
import { PodcastUploadComponent } from './components/podcast/upload/podcast-upload.component';
import { PodcastPlayerComponent } from './components/podcast/player/podcast-player.component';
import { DebugUploadComponent } from './components/debug-upload/debug-upload.component';

import { VideoListComponent } from './components/video/list/video-list.component';
import { PodcastListComponent } from './components/podcast/list/podcast-list.component';

const routes: Routes = [
  { path: '', component: MediaMainComponent },
  { path: 'videos', component: VideoListComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'videos/upload', component: VideoUploadComponent, canActivate: [AuthGuard] },
  { path: 'podcasts', component: PodcastListComponent },
  { path: 'podcasts/:id', component: PodcastDetailComponent },
  { path: 'podcasts/upload', component: PodcastUploadComponent, canActivate: [AuthGuard] },
  { path: 'podcasts/player/:id', component: PodcastPlayerComponent },
  { path: 'debug-upload', component: DebugUploadComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }