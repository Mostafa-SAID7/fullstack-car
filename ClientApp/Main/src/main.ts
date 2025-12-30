import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppRoutingModule } from './app/app-routing.module';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        // provideRouter is preferred, but for now we can still use common routes if we want, 
        // however for standalone we should typically pass the routes array directly.
        // I'll keep it simple for now and just pass an empty routes array if needed or use the module.
        // Actually, let's just use provideRouter([]).
        provideRouter([])
    ]
}).catch(err => console.error(err));
