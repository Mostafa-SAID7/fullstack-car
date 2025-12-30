import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Post } from '../../../../core/models/post.model';

@Component({
    selector: 'app-post-item',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './post-item.component.html'
})
export class PostItemComponent {
    @Input() post!: Post;
}
