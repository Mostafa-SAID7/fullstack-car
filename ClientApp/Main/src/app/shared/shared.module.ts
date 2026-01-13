import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

// Import standalone components
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { RtlLayoutComponent } from './components/rtl-layout/rtl-layout.component';

// Import standalone directives
import { RtlDirective } from './directives/rtl.directive';
import { BidiTextDirective } from './directives/bidi-text.directive';

// Import standalone pipes
import { RtlClassPipe } from './pipes/rtl-class.pipe';
import { RtlStylePipe } from './pipes/rtl-style.pipe';

@NgModule({
    declarations: [
        // No declarations needed for standalone components
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatDividerModule,
        MatBadgeModule,
        TranslateModule,
        // Import standalone components
        FormButtonComponent,
        FormInputComponent,
        LoadingSpinnerComponent,
        ErrorDisplayComponent,
        RtlLayoutComponent,
        // Import standalone directives
        RtlDirective,
        BidiTextDirective,
        // Import standalone pipes
        RtlClassPipe,
        RtlStylePipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatDividerModule,
        MatBadgeModule,
        TranslateModule,
        // Export standalone components
        FormButtonComponent,
        FormInputComponent,
        LoadingSpinnerComponent,
        ErrorDisplayComponent,
        RtlLayoutComponent,
        // Export standalone directives
        RtlDirective,
        BidiTextDirective,
        // Export standalone pipes
        RtlClassPipe,
        RtlStylePipe
    ]
})
export class SharedModule { }
