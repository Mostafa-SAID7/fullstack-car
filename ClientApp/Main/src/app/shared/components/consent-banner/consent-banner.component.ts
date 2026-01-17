import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyConsentService, ConsentPreferences, CookieInfo } from '../../../core/services/privacy-consent.service';
import { Subscription } from 'rxjs';

export interface ConsentBannerConfig {
  position: 'top' | 'bottom' | 'center';
  theme: 'light' | 'dark' | 'auto';
  showDetailsButton: boolean;
  showRejectButton: boolean;
  autoHide: boolean;
  autoHideDelay: number;
  compactMode: boolean;
}

/**
 * Consent Banner Component
 * 
 * GDPR/CCPA compliant consent banner with:
 * - Cookie consent management
 * - Granular privacy controls
 * - Cookie information display
 * - Accessibility compliance
 * - Customizable appearance
 */
@Component({
  selector: 'app-consent-banner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consent-banner.component.html',
  styleUrls: ['./consent-banner.component.css']
})
export class ConsentBannerComponent implements OnInit, OnDestroy {
  @Input() config = signal<ConsentBannerConfig>({
    position: 'bottom',
    theme: 'auto',
    showDetailsButton: true,
    showRejectButton: true,
    autoHide: false,
    autoHideDelay: 10000,
    compactMode: false
  });

  @Output() consentGiven = new EventEmitter<ConsentPreferences>();
  @Output() consentRejected = new EventEmitter<void>();
  @Output() preferencesUpdated = new EventEmitter<ConsentPreferences>();

  private privacyService = inject(PrivacyConsentService);

  // Signals for reactive state
  protected showBanner = signal(false);
  protected showDetails = signal(false);
  protected currentPreferences = signal<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
    performance: false
  });

  protected showCookieDetails = signal({
    necessary: false,
    analytics: false,
    marketing: false,
    personalization: false,
    performance: false
  });

  private subscriptions = new Subscription();
  private autoHideTimer?: number;

  // Computed values
  protected readonly shouldShowBanner = computed(() => {
    return this.showBanner() && !this.privacyService.getConsentStatus().given;
  });

  ngOnInit(): void {
    this.initializeConsentBanner();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
  }

  /**
   * Initialize consent banner
   */
  private initializeConsentBanner(): void {
    const consentStatus = this.privacyService.getConsentStatus();

    if (!consentStatus.given || consentStatus.expired) {
      this.showBanner.set(true);
      this.currentPreferences.set(this.privacyService.getCurrentPreferences());

      if (this.config().autoHide) {
        this.startAutoHideTimer();
      }
    }
  }

  /**
   * Setup subscriptions
   */
  private setupSubscriptions(): void {
    this.subscriptions.add(
      this.privacyService.consentGiven$.subscribe(given => {
        if (given) {
          this.showBanner.set(false);
        }
      })
    );

    this.subscriptions.add(
      this.privacyService.consentPreferences$.subscribe(preferences => {
        this.currentPreferences.set(preferences);
      })
    );
  }

  /**
   * Start auto hide timer
   */
  private startAutoHideTimer(): void {
    this.autoHideTimer = window.setTimeout(() => {
      this.closeBanner();
    }, this.config().autoHideDelay);
  }

  /**
   * Toggle details view
   */
  toggleDetails(): void {
    this.showDetails.set(!this.showDetails());
  }

  /**
   * Toggle cookie details for category
   */
  toggleCookieDetails(category: keyof ConsentPreferences): void {
    const current = this.showCookieDetails();
    this.showCookieDetails.set({
      ...current,
      [category]: !current[category]
    });
  }

  /**
   * Update preference for category
   */
  updatePreference(category: keyof ConsentPreferences, event: Event): void {
    if (category === 'necessary') return; // Cannot change necessary cookies

    const target = event.target as HTMLInputElement;
    const current = this.currentPreferences();

    this.currentPreferences.set({
      ...current,
      [category]: target.checked
    });
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
      performance: true
    };

    this.privacyService.setConsentPreferences(preferences);
    this.consentGiven.emit(preferences);
    this.showBanner.set(false);
  }

  /**
   * Reject all non-necessary cookies
   */
  rejectAll(): void {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      performance: false
    };

    this.privacyService.setConsentPreferences(preferences);
    this.consentRejected.emit();
    this.showBanner.set(false);
  }

  /**
   * Save current preferences
   */
  savePreferences(): void {
    const preferences = this.currentPreferences();
    this.privacyService.setConsentPreferences(preferences);
    this.preferencesUpdated.emit(preferences);
    this.showBanner.set(false);
  }

  /**
   * Close banner without saving
   */
  closeBanner(): void {
    this.showBanner.set(false);
  }

  /**
   * Get cookies by category
   */
  getCookiesByCategory(category: CookieInfo['category']): CookieInfo[] {
    return this.privacyService.getCookiesByCategory(category);
  }

  /**
   * Open privacy policy
   */
  openPrivacyPolicy(): void {
    window.open('/privacy-policy', '_blank');
  }

  /**
   * Open cookie policy
   */
  openCookiePolicy(): void {
    window.open('/cookie-policy', '_blank');
  }

  /**
   * Show banner manually
   */
  showConsentBanner(): void {
    this.showBanner.set(true);
  }

  /**
   * Hide banner manually
   */
  hideConsentBanner(): void {
    this.showBanner.set(false);
  }
}