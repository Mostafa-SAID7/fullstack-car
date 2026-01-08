import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaRoutingModule } from './media-routing.module';
import { MediaService } from './services/media.service';
import { VideoListComponent } from './components/video-list/video-list.component';
import { PodcastListComponent } from './components/podcast-list/podcast-list.component';
import { MediaDashboardComponent } from './components/media-dashboard/media-dashboard.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { PodcastDetailComponent } from './components/podcast-detail/podcast-detail.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { PodcastUploadComponent } from './components/podcast-upload/podcast-upload.component';

@NgModule({
    imports: [
        CommonModule,
        MediaRoutingModule,
        VideoListComponent,
        PodcastListComponent,
        MediaDashboardComponent,
        MediaCardComponent,
        VideoDetailComponent,
        PodcastDetailComponent,
        VideoUploadComponent,
        PodcastUploadComponent
    ],
    providers: [MediaService]
})
export class MediaModule { }