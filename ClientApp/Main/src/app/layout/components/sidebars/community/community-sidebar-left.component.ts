import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QAQuestionService } from '../../../../features/community/components/qa/services/qa-question.service';

@Component({
    selector: 'app-community-sidebar-left',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    template: `
        <div class="space-y-6">
            <!-- Navigation Links -->
            <div class="space-y-1">
                <div *ngFor="let item of menuItems"
                    class="flex items-center justify-between p-2 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-secondary dark:hover:bg-white/5"
                    [routerLink]="item.link"
                    routerLinkActive="!text-primary bg-primary/10 dark:bg-primary/20 shadow-sm active-nav">
                    
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/30 transition-all duration-300 group-[.active-nav]:bg-white group-[.active-nav]:dark:bg-white/5 group-[.active-nav]:text-primary group-[.active-nav]:shadow-sm">
                            <i [class]="'fa-solid ' + item.icon + ' text-sm'"></i>
                        </div>
                        <span class="text-xs font-bold md:hidden lg:block">{{ 'community.' + item.id + '.title' | translate }}</span>
                    </div>

                    <!-- Count Badge -->
                    <span *ngIf="item.count > 0" 
                        class="text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors md:hidden lg:block">
                        {{ item.count }}
                    </span>
                </div>
            </div>
        </div>
    `
})
export class CommunitySidebarLeftComponent implements OnInit {
    menuItems = [
        { id: 'questions', label: 'Questions', icon: 'fa-circle-question', link: '/community/qa', count: 0 },
        { id: 'posts', label: 'Posts', icon: 'fa-pencil-square', link: '/community/posts', count: 45 },
        { id: 'guides', label: 'Guides', icon: 'fa-book-open', link: '/community/guides', count: 8 },
        { id: 'friends', label: 'Friends', icon: 'fa-user-group', link: '/community/friends', count: 120 },
        { id: 'groups', label: 'Groups', icon: 'fa-users', link: '/community/groups', count: 5 },
        { id: 'pages', label: 'Pages', icon: 'fa-file-lines', link: '/community/pages', count: 3 },
        { id: 'reviews', label: 'Reviews', icon: 'fa-star', link: '/community/reviews', count: 24 },
        { id: 'maps', label: 'Maps', icon: 'fa-map-location-dot', link: '/community/maps', count: 0 }
    ];

    constructor(private qaQuestionService: QAQuestionService) { }

    ngOnInit(): void {
        this.loadQuestionsCount();
    }

    private loadQuestionsCount(): void {
        // Fetch total count of all questions
        this.qaQuestionService.getQuestions({ pageSize: 1 }).subscribe({
            next: (response) => {
                if (response.succeeded && response.data) {
                    const questionsItem = this.menuItems.find(item => item.id === 'questions');
                    if (questionsItem) {
                        questionsItem.count = response.data.totalCount;
                    }
                }
            },
            error: (error) => console.error('Error loading questions count:', error)
        });
    }
}
