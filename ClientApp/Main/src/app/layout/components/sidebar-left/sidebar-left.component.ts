import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar-left',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './sidebar-left.component.html'
})
export class SidebarLeftComponent { }
