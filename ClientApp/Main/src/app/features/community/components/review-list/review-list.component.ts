import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Review } from '../../../../core/models/review.model';
import { ReviewService } from '../../services/review.service';
import { ReviewItemComponent } from '../review-item/review-item.component';

@Component({
    selector: 'app-review-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, ReviewItemComponent],
    template: `
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-sm font-black uppercase tracking-widest text-primary">{{ 'main.community.reviews.recent' | translate }}</h2>
                <button class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary">{{ 'main.community.common.seeAll' | translate }}</button>
            </div>
            <div class="space-y-4">
                <app-review-item *ngFor="let review of reviews" [review]="review"></app-review-item>
            </div>
            <div *ngIf="reviews.length === 0" class="fb-card p-10 text-center border-dashed border-2 border-border/10">
                <i class="fa-solid fa-star-half-stroke text-4xl text-muted-foreground/20 mb-3"></i>
                <p class="text-sm text-muted-foreground/60 font-black uppercase tracking-widest">{{ 'main.community.reviews.noReviews' | translate }}</p>
            </div>
        </div>
    `,
    host: { 'class': 'block' }
})
export class ReviewListComponent implements OnInit {
    reviews: Review[] = [];

    constructor(private reviewService: ReviewService) { }

    ngOnInit(): void {
        this.reviewService.getReviews(1, 3).subscribe(result => {
            this.reviews = result.items;
        });
    }
}
