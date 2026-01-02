import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GuideListItem, GuideDifficulty } from '../../models/guide.model';

@Component({
    selector: 'app-guide-card',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './guide-card.component.html',
    styleUrls: ['./guide-card.component.scss']
})
export class GuideCardComponent {
    @Input() guide!: GuideListItem;
    @Output() bookmarkClick = new EventEmitter<GuideListItem>();

    getDifficultyColor(difficulty: GuideDifficulty): string {
        switch (difficulty) {
            case GuideDifficulty.Beginner:
                return 'difficulty-beginner';
            case GuideDifficulty.Intermediate:
                return 'difficulty-intermediate';
            case GuideDifficulty.Advanced:
                return 'difficulty-advanced';
            case GuideDifficulty.Expert:
                return 'difficulty-expert';
            default:
                return '';
        }
    }

    formatReadTime(minutes: number): string {
        if (minutes < 60) {
            return `${minutes} min read`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }

    onBookmarkClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.bookmarkClick.emit(this.guide);
    }
}
