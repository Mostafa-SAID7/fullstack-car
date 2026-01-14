import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages: Language[] = [];
  currentLanguage: Language | null = null;
  showDropdown = false;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguageDetails();

    // Subscribe to language changes
    this.languageService.getCurrentLanguage$().subscribe(langCode => {
      this.currentLanguage = this.languageService.getLanguageDetails(langCode);
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language.code);
    this.showDropdown = false;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  getLanguageFlag(code: string): string {
    const flagMap: Record<string, string> = {
      'en-US': '🇺🇸',
      'ar-EG': '🇪🇬',
      'ar-AE': '🇦🇪',
      'ar-SA': '🇸🇦'
    };
    return flagMap[code] || '🌐';
  }
}
