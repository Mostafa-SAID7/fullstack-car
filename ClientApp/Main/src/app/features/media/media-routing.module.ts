import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaMainComponent } from './components/media-main/media-main.component';
import { VideoDetailComponent } from './components/video/detail/video-detail.component';
import { VideoUploadComponent } from './components/video/upload/video-upload.component';
import { PodcastDetailComponent } from './components/podcast/detail/podcast-detail.component';
import { PodcastUploadComponent } from './components/podcast/upload/podcast-upload.component';
import { PodcastPlayerComponent } from './components/podcast/player/podcast-player.component';
import { DebugUploadComponent } from './components/debug-upload/debug-upload.component';

const routes: Routes = [
  { path: '', component: MediaMainComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'videos/upload', component: VideoUploadComponent },
  { path: 'podcasts/:id', component: PodcastDetailComponent },
  { path: 'podcasts/upload', component: PodcastUploadComponent },
  { path: 'podcasts/player/:id', component: PodcastPlayerComponent },
  { path: 'debug-upload', component: DebugUploadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }