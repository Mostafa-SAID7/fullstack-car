import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NewsCardComponent } from './news-card.component';
import { Article } from '../../../../../core/models/news.model';

describe('NewsCardComponent', () => {
  let component: NewsCardComponent;
  let fixture: ComponentFixture<NewsCardComponent>;

  const mockArticle: Article = {
    id: '1',
    title: 'Test Article Title',
    slug: 'test-article',
    summary: 'This is a test article summary',
    content: 'Test content',
    status: 1,
    priority: 1,
    viewsCount: 150,
    likesCount: 25,
    commentsCount: 8,
    sharesCount: 5,
    isFeatured: false,
    authorId: 'author1',
    categoryId: 'cat1',
    createdAt: new Date(),
    publishedAt: new Date(),
    featuredImageUrl: 'https://example.com/image.jpg',
    author: {
      firstName: 'John',
      lastName: 'Doe'
    },
    category: {
      name: 'automotive'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewsCardComponent,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsCardComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display article information', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockArticle.title);
    expect(compiled.textContent).toContain(mockArticle.summary);
    expect(compiled.textContent).toContain(mockArticle.author?.firstName);
    expect(compiled.textContent).toContain(mockArticle.author?.lastName);
    expect(compiled.textContent).toContain(mockArticle.likesCount.toString());
    expect(compiled.textContent).toContain(mockArticle.commentsCount.toString());
  });

  it('should use translation keys for UI elements', () => {
    fixture.detectChanges();
    const template = fixture.debugElement.nativeElement.innerHTML;
    
    // Check if translation pipes are used in template
    expect(template).toContain('news.readTime');
    expect(template).toContain('actions.like');
    expect(template).toContain('actions.comment');
    expect(template).toContain('sharing.title');
    expect(template).toContain('actions.save');
  });

  it('should map category names to translation keys correctly', () => {
    expect(component.getCategoryTranslation('automotive')).toBe('categories.automotive');
    expect(component.getCategoryTranslation('technology')).toBe('categories.technology');
    expect(component.getCategoryTranslation('business')).toBe('categories.business');
    expect(component.getCategoryTranslation('unknown')).toBe('categories.all');
    expect(component.getCategoryTranslation(undefined)).toBe('categories.all');
  });

  it('should show breaking news badge for high priority articles', () => {
    component.article = { ...mockArticle, priority: 3 };
    fixture.detectChanges();
    
    const template = fixture.debugElement.nativeElement.innerHTML;
    expect(template).toContain('categories.breaking');
  });

  it('should display author initials when available', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const authorInitial = compiled.querySelector('.w-6.h-6.rounded-full');
    
    expect(authorInitial?.textContent?.trim()).toBe('J');
  });

  it('should show default initial when author name is not available', () => {
    component.article = { ...mockArticle, author: undefined };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const authorInitial = compiled.querySelector('.w-6.h-6.rounded-full');
    
    expect(authorInitial?.textContent?.trim()).toBe('A');
  });
});