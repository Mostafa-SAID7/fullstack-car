import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

// Services
import { AuthService } from './services/auth.service';
import { OAuthService } from './services/oauth.service';
import { ProfileService } from './services/profile.service';
import { SecurityService } from './services/security.service';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/theme.service';

// Guards
import { AuthGuard, GuestGuard, RoleGuard } from './guards/auth.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

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
    OAuthService,
    ProfileService,
    SecurityService,
    LayoutService,
    ThemeService,
    
    // Guards
    AuthGuard,
    GuestGuard,
    RoleGuard,
    
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
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