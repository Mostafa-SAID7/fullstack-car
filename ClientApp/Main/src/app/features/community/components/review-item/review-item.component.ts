import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Review } from '../../../../core/models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
    selector: 'app-review-item',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './review-item.component.html',
    host: { 'class': 'block' }
})
export class ReviewItemComponent {
    @Input() review!: Review;

    constructor(private reviewService: ReviewService) { }

    markHelpful(): void {
        this.reviewService.markHelpful(this.review.id).subscribe(result => {
            if (result.succeeded) {
                this.review.helpfulCount++;
            }
        });
    }

    getStars(): number[] {
        return Array(this.review.rating).fill(0);
    }
}
