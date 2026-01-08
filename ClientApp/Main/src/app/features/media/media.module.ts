import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaRoutingModule } from './media-routing.module';
import { MediaService } from './services/media.service';
import { PodcastService } from './services/podcast.service';
import { VideoService } from './services/video.service';

// Import all components
import { MediaMainComponent } from './components/media-main/media-main.component';
import { MediaTabNavComponent } from './components/shared/media-tab-nav/media-tab-nav.component';
import { VideoListComponent } from './components/video/list/video-list.component';
import { VideoDashboardComponent } from './components/video/dashboard/video-dashboard.component';
import { VideoSearchComponent } from './components/video/search/video-search.component';
import { VideoAnalyticsComponent } from './components/video/analytics/video-analytics.component';
import { VideoCategoryComponent } from './components/video/category/video-category.component';
import { PodcastListComponent } from './components/podcast/list/podcast-list.component';
import { MediaDashboardComponent } from './components/media-dashboard/media-dashboard.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { VideoDetailComponent } from './components/video/detail/video-detail.component';
import { PodcastDetailComponent } from './components/podcast/detail/podcast-detail.component';
import { VideoUploadComponent } from './components/video/upload/video-upload.component';
import { PodcastUploadComponent } from './components/podcast/upload/podcast-upload.component';
import { PodcastPlayerComponent } from './components/podcast/player/podcast-player.component';
import { PodcastDashboardComponent } from './components/podcast/dashboard/podcast-dashboard.component';
import { PodcastSearchComponent } from './components/podcast/search/podcast-search.component';
import { PodcastCategoryComponent } from './components/podcast/category/podcast-category.component';
import { PodcastSubscriptionComponent } from './components/podcast/subscription/podcast-subscription.component';
import { DebugUploadComponent } from './components/debug-upload/debug-upload.component';

@NgModule({
    imports: [
        CommonModule,
        MediaRoutingModule,
        MediaMainComponent,
        MediaTabNavComponent,
        VideoListComponent,
        VideoDashboardComponent,
        VideoSearchComponent,
        VideoAnalyticsComponent,
        VideoCategoryComponent,
        PodcastListComponent,
        MediaDashboardComponent,
        MediaCardComponent,
        VideoDetailComponent,
        PodcastDetailComponent,
        VideoUploadComponent,
        PodcastUploadComponent,
        PodcastPlayerComponent,
        PodcastDashboardComponent,
        PodcastSearchComponent,
        PodcastCategoryComponent,
        PodcastSubscriptionComponent,
        DebugUploadComponent
    ],
    providers: [MediaService, PodcastService, VideoService]
})
export class MediaModule { }