import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { HttpClientService } from './http-client.service';
import { MediaApiService } from './media-api.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    HttpClientService,
    MediaApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class ApiModule { }