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
import { ButtonComponent } from './components/ui/button/button.component';
import { InputComponent } from './components/ui/input/input.component';
import { LoadingSpinnerComponent } from './components/ui/loading/loading-spinner.component';
import { PaginationComponent } from './components/ui/pagination/pagination.component';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { RtlLayoutComponent } from './components/rtl-layout/rtl-layout.component';

// Import standalone directives
import { RtlDirective } from './directives/rtl.directive';
import { BidiTextDirective } from './directives/bidi-text.directive';

// Import standalone pipes
import { RtlClassPipe } from './pipes/rtl-class.pipe';
import { RtlStylePipe } from './pipes/rtl-style.pipe';
import { CultureDatePipe } from './pipes/culture-date.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

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
        ButtonComponent,
        InputComponent,
        LoadingSpinnerComponent,
        PaginationComponent,
        ErrorDisplayComponent,
        RtlLayoutComponent,
        // Import standalone directives
        RtlDirective,
        BidiTextDirective,
        // Import standalone pipes
        RtlClassPipe,
        RtlStylePipe,
        CultureDatePipe,
        RelativeTimePipe
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
        ButtonComponent,
        InputComponent,
        LoadingSpinnerComponent,
        PaginationComponent,
        ErrorDisplayComponent,
        RtlLayoutComponent,
        // Export standalone directives
        RtlDirective,
        BidiTextDirective,
        // Export standalone pipes
        RtlClassPipe,
        RtlStylePipe,
        CultureDatePipe,
        RelativeTimePipe
    ]
})
export class SharedModule { }
