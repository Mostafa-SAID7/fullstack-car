import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './create-post.component.html',
    host: { 'class': 'block' }
})
export class CreatePostComponent { }
