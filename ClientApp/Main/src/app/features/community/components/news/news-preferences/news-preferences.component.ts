import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-news-preferences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="p-4 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-6">
      
      <!-- Header -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <div class="text-center">
          <h1 class="text-3xl font-black text-foreground uppercase tracking-widest mb-2">
            {{ 'preferences.title' | translate }}
          </h1>
          <p class="text-muted-foreground font-bold text-sm uppercase tracking-widest">
            {{ 'preferences.customize' | translate }}
          </p>
        </div>
      </div>

      <!-- Preferences Form -->
      <form [formGroup]="preferencesForm" class="space-y-6">
        
        <!-- Categories Selection -->
        <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
          <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-6">
            {{ 'preferences.selectCategories' | translate }}
          </h2>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" formArrayName="categories">
            <div *ngFor="let category of availableCategories; let i = index" class="flex items-center">
              <input 
                type="checkbox" 
                [id]="'category-' + i"
                [formControlName]="i"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2">
              <label 
                [for]="'category-' + i" 
                class="ml-2 text-sm font-medium text-foreground">
                {{ category.translationKey | translate }}
              </label>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
          <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-6">
            {{ 'preferences.notifications' | translate }}
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-foreground">
                {{ 'preferences.enableNotifications' | translate }}
              </label>
              <input 
                type="checkbox" 
                formControlName="enableNotifications"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2">
            </div>
            
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-foreground">
                {{ 'preferences.frequency' | translate }}
              </label>
              <select 
                formControlName="notificationFrequency"
                class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                <option value="never">{{ 'preferences.never' | translate }}</option>
                <option value="immediately">{{ 'preferences.immediately' | translate }}</option>
                <option value="hourly">{{ 'preferences.hourly' | translate }}</option>
                <option value="daily">{{ 'preferences.daily' | translate }}</option>
                <option value="weekly">{{ 'preferences.weekly' | translate }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Email Digest Settings -->
        <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
          <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-6">
            {{ 'preferences.emailDigest' | translate }}
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <input 
                type="radio" 
                id="digest-never" 
                value="never" 
                formControlName="emailDigest"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2">
              <label for="digest-never" class="text-sm font-medium text-foreground">
                {{ 'preferences.never' | translate }}
              </label>
            </div>
            
            <div class="flex items-center space-x-4">
              <input 
                type="radio" 
                id="digest-daily" 
                value="daily" 
                formControlName="emailDigest"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2">
              <label for="digest-daily" class="text-sm font-medium text-foreground">
                {{ 'preferences.dailyDigest' | translate }}
              </label>
            </div>
            
            <div class="flex items-center space-x-4">
              <input 
                type="radio" 
                id="digest-weekly" 
                value="weekly" 
                formControlName="emailDigest"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2">
              <label for="digest-weekly" class="text-sm font-medium text-foreground">
                {{ 'preferences.weeklyDigest' | translate }}
              </label>
            </div>
          </div>
        </div>

        <!-- Language and Region Settings -->
        <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
          <h2 class="text-xl font-black text-foreground uppercase tracking-widest mb-6">
            {{ 'preferences.language' | translate }} & {{ 'preferences.region' | translate }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-foreground">
                {{ 'preferences.language' | translate }}
              </label>
              <select 
                formControlName="preferredLanguage"
                class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                <option value="en-US">English (US)</option>
                <option value="ar-EG">العربية (مصر)</option>
                <option value="ar-AE">العربية (الإمارات)</option>
                <option value="ar-SA">العربية (السعودية)</option>
              </select>
            </div>
            
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-foreground">
                {{ 'preferences.region' | translate }}
              </label>
              <select 
                formControlName="regionalFocus"
                class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl px-4 py-3 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                <option value="global">Global</option>
                <option value="local">{{ 'categories.local' | translate }}</option>
                <option value="regional">Regional</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button"
              (click)="savePreferences()"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
              {{ 'preferences.savePreferences' | translate }}
            </button>
            
            <button 
              type="button"
              (click)="resetPreferences()"
              class="px-8 py-4 bg-secondary dark:bg-white/5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
              {{ 'preferences.resetPreferences' | translate }}
            </button>
          </div>
        </div>
        
      </form>
    </div>
  `
})
export class NewsPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  
  availableCategories = [
    { key: 'automotive', translationKey: 'categories.automotive' },
    { key: 'technology', translationKey: 'categories.technology' },
    { key: 'business', translationKey: 'categories.business' },
    { key: 'sports', translationKey: 'categories.sports' },
    { key: 'entertainment', translationKey: 'categories.entertainment' },
    { key: 'health', translationKey: 'categories.health' },
    { key: 'science', translationKey: 'categories.science' },
    { key: 'politics', translationKey: 'categories.politics' },
    { key: 'lifestyle', translationKey: 'categories.lifestyle' },
    { key: 'travel', translationKey: 'categories.travel' },
    { key: 'education', translationKey: 'categories.education' },
    { key: 'environment', translationKey: 'categories.environment' },
    { key: 'local', translationKey: 'categories.local' },
    { key: 'international', translationKey: 'categories.international' }
  ];

  constructor(private fb: FormBuilder) {
    this.preferencesForm = this.fb.group({
      categories: this.fb.array(this.availableCategories.map(() => false)),
      enableNotifications: [true],
      notificationFrequency: ['daily'],
      emailDigest: ['weekly'],
      preferredLanguage: ['en-US'],
      regionalFocus: ['global']
    });
  }

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  get categoriesFormArray(): FormArray {
    return this.preferencesForm.get('categories') as FormArray;
  }

  loadUserPreferences(): void {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('newsPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      this.preferencesForm.patchValue(preferences);
    }
  }

  savePreferences(): void {
    const preferences = this.preferencesForm.value;
    
    // Save to localStorage (in real app, save to backend)
    localStorage.setItem('newsPreferences', JSON.stringify(preferences));
    
    // Show success message
    console.log('Preferences saved:', preferences);
    
    // In real implementation, call API to save preferences
    // this.newsService.savePreferences(preferences).subscribe(...)
  }

  resetPreferences(): void {
    this.preferencesForm.reset({
      categories: this.availableCategories.map(() => false),
      enableNotifications: true,
      notificationFrequency: 'daily',
      emailDigest: 'weekly',
      preferredLanguage: 'en-US',
      regionalFocus: 'global'
    });
    
    localStorage.removeItem('newsPreferences');
  }
}