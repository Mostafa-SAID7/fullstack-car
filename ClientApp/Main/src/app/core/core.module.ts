import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

// Services
import { AuthService } from './services/auth.service';
import { MediaService } from './services/media.service';
import { OAuthService } from './services/oauth.service';
import { ProfileService } from './services/profile.service';
import { SecurityService } from './services/security.service';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { SignalRService } from './services/signalr.service';

// Guards
import { AuthGuard, GuestGuard, RoleGuard, ContentCreatorGuard, AdminGuard } from './guards/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    // Services
    AuthService,
    MediaService,
    OAuthService,
    ProfileService,
    SecurityService,
    LayoutService,
    ThemeService,
    NotificationService,
    SignalRService,
    
    // Guards
    AuthGuard,
    GuestGuard,
    RoleGuard,
    ContentCreatorGuard,
    AdminGuard
  ],
  exports: [
    SharedModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}