import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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

    constructor(private translate: TranslateService) {}

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

    getDifficultyTranslationKey(difficulty: GuideDifficulty): string {
        switch (difficulty) {
            case GuideDifficulty.Beginner:
                return 'guides.difficulty.beginner';
            case GuideDifficulty.Intermediate:
                return 'guides.difficulty.intermediate';
            case GuideDifficulty.Advanced:
                return 'guides.difficulty.advanced';
            case GuideDifficulty.Expert:
                return 'guides.difficulty.expert';
            default:
                return 'guides.difficulty.beginner';
        }
    }

    formatReadTime(minutes: number): string {
        if (minutes < 60) {
            return `${minutes} ${this.translate.instant('guides.duration.minutes')}`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes > 0) {
            return `${hours}${this.translate.instant('guides.duration.hours')} ${remainingMinutes}${this.translate.instant('guides.duration.minutes')}`;
        }
        return `${hours}${this.translate.instant('guides.duration.hours')}`;
    }

    onBookmarkClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.bookmarkClick.emit(this.guide);
    }
}
