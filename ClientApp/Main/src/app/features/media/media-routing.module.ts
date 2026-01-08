import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaDashboardComponent } from './components/media-dashboard/media-dashboard.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { PodcastListComponent } from './components/podcast-list/podcast-list.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { PodcastUploadComponent } from './components/podcast-upload/podcast-upload.component';

const routes: Routes = [
  { path: '', component: MediaDashboardComponent },
  { path: 'videos', component: VideoListComponent },
  { path: 'videos/upload', component: VideoUploadComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'podcasts', component: PodcastListComponent },
  { path: 'podcasts/upload', component: PodcastUploadComponent },
  { path: 'podcasts/:id', component: PodcastDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }