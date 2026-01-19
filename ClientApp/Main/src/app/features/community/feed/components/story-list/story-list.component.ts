import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-story-list',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './story-list.component.html'
})
export class StoryListComponent { }
