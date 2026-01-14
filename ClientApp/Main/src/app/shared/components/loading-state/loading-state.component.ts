import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingType = 'spinner' | 'skeleton' | 'grid' | 'list';

@Component({
    selector: 'app-loading-state',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-state.component.html',

})
export class LoadingStateComponent {
    @Input() type: LoadingType = 'spinner';
    @Input() count = 3;
    @Input() message = 'Loading...';

    get items(): number[] {
        return Array(this.count).fill(0).map((_, i) => i);
    }
}
