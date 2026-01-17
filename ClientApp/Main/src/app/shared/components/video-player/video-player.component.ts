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
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { EventTrackingService } from '../../../core/services/event-tracking.service';

export interface VideoSource {
  src: string;
  type: string;
  quality: '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
  bitrate?: number;
}

export interface VideoTrack {
  kind: 'subtitles' | 'captions' | 'chapters' | 'metadata';
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

export interface VideoPlayerConfig {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  preload: 'none' | 'metadata' | 'auto';
  playbackRates: number[];
  enableKeyboardShortcuts: boolean;
  enableFullscreen: boolean;
  enablePictureInPicture: boolean;
  enableQualitySelector: boolean;
  enableSubtitles: boolean;
  enableAnalytics: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface PlaybackState {
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  paused: boolean;
  ended: boolean;
  buffered: TimeRanges | null;
  playbackRate: number;
  quality: string;
  fullscreen: boolean;
  pictureInPicture: boolean;
}

export interface VideoPlayerEvents {
  play: void;
  pause: void;
  ended: void;
  timeupdate: { currentTime: number; duration: number };
  volumechange: { volume: number; muted: boolean };
  ratechange: { playbackRate: number };
  qualitychange: { quality: string };
  fullscreenchange: { fullscreen: boolean };
  error: { error: MediaError | null };
}

/**
 * Advanced Video Player Component
 * 
 * Feature-rich video player with:
 * - Adaptive bitrate streaming
 * - Multiple quality options
 * - Subtitle/caption support
 * - Keyboard shortcuts
 * - Picture-in-picture mode
 * - Analytics tracking
 * - Accessibility compliance
 */
@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-player.component.html',
  styles: [`
    .video-player {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      aspect-ratio: 16 / 9;
    }

    .video-player.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      aspect-ratio: unset;
    }

    .controls-overlay {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    }

    .progress-input {
      background: transparent;
    }

    .progress-input::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .progress-input::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .volume-slider::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }

    .volume-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
    }

    .control-button {
      transition: all 0.2s ease-in-out;
    }

    .control-button:hover {
      transform: scale(1.1);
    }

    .play-button:hover {
      transform: scale(1.05);
    }

    .playback-rate-menu,
    .quality-menu {
      animation: fadeInUp 0.2s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  @Input() videoSources = signal<VideoSource[]>([]);
  @Input() videoTracks = signal<VideoTrack[]>([]);
  @Input() config = signal<VideoPlayerConfig>({
    autoplay: false,
    muted: false,
    loop: false,
    controls: true,
    preload: 'metadata',
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
    enableKeyboardShortcuts: true,
    enableFullscreen: true,
    enablePictureInPicture: true,
    enableQualitySelector: true,
    enableSubtitles: true,
    enableAnalytics: true,
    theme: 'dark'
  });

  @Output() playbackStateChange = new EventEmitter<PlaybackState>();
  @Output() videoEvents = new EventEmitter<{ event: keyof VideoPlayerEvents; data: any }>();

  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);

  // Signals for reactive state
  protected playbackState = signal<PlaybackState>({
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    paused: true,
    ended: false,
    buffered: null,
    playbackRate: 1,
    quality: 'auto',
    fullscreen: false,
    pictureInPicture: false
  });

  protected currentSource = signal<VideoSource | null>(null);
  protected isLoading = signal(false);
  protected hasError = signal(false);
  protected errorMessage = signal('');
  protected showControls = signal(true);
  protected showPlaybackRateMenu = signal(false);
  protected showQualityMenu = signal(false);
  protected subtitlesEnabled = signal(false);
  private isSeeking = signal(false);

  private controlsTimer?: number;
  private analyticsTimer?: number;
  private playbackStartTime?: number;

  ngOnInit(): void {
    this.initializeVideoPlayer();
    this.setupEventListeners();
    this.setupAnalytics();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initialize video player
   */
  private initializeVideoPlayer(): void {
    if (this.videoSources().length > 0) {
      this.currentSource.set(this.videoSources()[0]);
    }

    // Set initial volume
    const video = this.videoElement.nativeElement;
    video.volume = this.playbackState().volume;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    const video = this.videoElement.nativeElement;

    // Fullscreen change events
    document.addEventListener('fullscreenchange', () => {
      this.updatePlaybackState({ fullscreen: !!document.fullscreenElement });
    });

    // Picture-in-picture events
    video.addEventListener('enterpictureinpicture', () => {
      this.updatePlaybackState({ pictureInPicture: true });
    });

    video.addEventListener('leavepictureinpicture', () => {
      this.updatePlaybackState({ pictureInPicture: false });
    });

    // Keyboard shortcuts
    if (this.config().enableKeyboardShortcuts) {
      document.addEventListener('keydown', (event) => {
        if (document.activeElement === video || document.activeElement?.closest('.video-player')) {
          this.handleKeyboardShortcut(event);
        }
      });
    }
  }

  /**
   * Setup analytics tracking
   */
  private setupAnalytics(): void {
    if (!this.config().enableAnalytics) return;

    // Track video start
    this.analyticsTimer = window.setInterval(() => {
      if (!this.playbackState().paused && this.playbackStartTime) {
        const watchTime = Date.now() - this.playbackStartTime;

        this.eventTrackingService.trackCustomEvent({
          name: 'video_progress',
          category: 'media',
          action: 'watch_time',
          value: Math.floor(watchTime / 1000),
          parameters: {
            video_duration: this.playbackState().duration,
            current_time: this.playbackState().currentTime,
            quality: this.currentSource()?.quality,
            playback_rate: this.playbackState().playbackRate
          }
        });
      }
    }, 30000); // Track every 30 seconds
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (!this.config().enableKeyboardShortcuts) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.seekRelative(-10);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.seekRelative(10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.adjustVolume(0.1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.adjustVolume(-0.1);
        break;
      case 'KeyM':
        event.preventDefault();
        this.toggleMute();
        break;
      case 'KeyF':
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case 'Escape':
        if (this.playbackState().fullscreen) {
          this.exitFullscreen();
        }
        break;
    }
  }

  /**
   * Video event handlers
   */
  onLoadedMetadata(): void {
    const video = this.videoElement.nativeElement;
    this.updatePlaybackState({
      duration: video.duration,
      buffered: video.buffered
    });
    this.isLoading.set(false);
  }

  onTimeUpdate(): void {
    if (this.isSeeking()) return;

    const video = this.videoElement.nativeElement;
    this.updatePlaybackState({
      currentTime: video.currentTime,
      buffered: video.buffered
    });

    this.videoEvents.emit({
      event: 'timeupdate',
      data: { currentTime: video.currentTime, duration: video.duration }
    });
  }

  onPlay(): void {
    this.updatePlaybackState({ paused: false });
    this.playbackStartTime = Date.now();

    this.videoEvents.emit({ event: 'play', data: undefined });

    if (this.config().enableAnalytics) {
      this.analyticsService.trackVideoInteraction(
        this.currentSource()?.src || 'unknown',
        'play',
        this.playbackState().currentTime
      );
    }
  }

  onPause(): void {
    this.updatePlaybackState({ paused: true });

    this.videoEvents.emit({ event: 'pause', data: undefined });

    if (this.config().enableAnalytics) {
      this.analyticsService.trackVideoInteraction(
        this.currentSource()?.src || 'unknown',
        'pause',
        this.playbackState().currentTime
      );
    }
  }

  onEnded(): void {
    this.updatePlaybackState({ ended: true, paused: true });

    this.videoEvents.emit({ event: 'ended', data: undefined });

    if (this.config().enableAnalytics) {
      this.analyticsService.trackVideoInteraction(
        this.currentSource()?.src || 'unknown',
        'complete',
        this.playbackState().duration
      );
    }
  }

  onVolumeChange(): void {
    const video = this.videoElement.nativeElement;
    this.updatePlaybackState({
      volume: video.volume,
      muted: video.muted
    });

    this.videoEvents.emit({
      event: 'volumechange',
      data: { volume: video.volume, muted: video.muted }
    });
  }

  onRateChange(): void {
    const video = this.videoElement.nativeElement;
    this.updatePlaybackState({ playbackRate: video.playbackRate });

    this.videoEvents.emit({
      event: 'ratechange',
      data: { playbackRate: video.playbackRate }
    });
  }

  onError(event: Event): void {
    const video = this.videoElement.nativeElement;
    const error = video.error;

    this.hasError.set(true);
    this.isLoading.set(false);

    let message = 'An unknown error occurred';
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Video playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error occurred';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Video decoding error';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Video format not supported';
          break;
      }
    }

    this.errorMessage.set(message);

    this.videoEvents.emit({ event: 'error', data: { error } });

    if (this.config().enableAnalytics) {
      this.analyticsService.trackException(new Error(message), false);
    }
  }

  /**
   * Playback controls
   */
  play(): void {
    this.videoElement.nativeElement.play().catch(error => {
      console.error('Failed to play video:', error);
      this.onError(new Event('error'));
    });
  }

  pause(): void {
    this.videoElement.nativeElement.pause();
  }

  togglePlayPause(): void {
    if (this.playbackState().paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seekTo(event: Event): void {
    const target = event.target as HTMLInputElement;
    const time = parseFloat(target.value);
    this.videoElement.nativeElement.currentTime = time;

    if (this.config().enableAnalytics) {
      this.analyticsService.trackVideoInteraction(
        this.currentSource()?.src || 'unknown',
        'seek',
        time
      );
    }
  }

  seekRelative(seconds: number): void {
    const video = this.videoElement.nativeElement;
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    video.currentTime = newTime;
  }

  startSeeking(): void {
    this.isSeeking.set(true);
  }

  stopSeeking(): void {
    this.isSeeking.set(false);
  }

  /**
   * Volume controls
   */
  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    this.videoElement.nativeElement.volume = volume;
  }

  adjustVolume(delta: number): void {
    const video = this.videoElement.nativeElement;
    const newVolume = Math.max(0, Math.min(1, video.volume + delta));
    video.volume = newVolume;
  }

  toggleMute(): void {
    const video = this.videoElement.nativeElement;
    video.muted = !video.muted;
  }

  /**
   * Playback rate controls
   */
  togglePlaybackRateMenu(): void {
    this.showPlaybackRateMenu.set(!this.showPlaybackRateMenu());
    this.showQualityMenu.set(false);
  }

  setPlaybackRate(rate: number): void {
    this.videoElement.nativeElement.playbackRate = rate;
    this.showPlaybackRateMenu.set(false);
  }

  /**
   * Quality controls
   */
  toggleQualityMenu(): void {
    this.showQualityMenu.set(!this.showQualityMenu());
    this.showPlaybackRateMenu.set(false);
  }

  setQuality(source: VideoSource): void {
    const video = this.videoElement.nativeElement;
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    this.currentSource.set(source);
    video.src = source.src;

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        this.play();
      }
    }, { once: true });

    this.showQualityMenu.set(false);

    this.videoEvents.emit({
      event: 'qualitychange',
      data: { quality: source.quality }
    });
  }

  /**
   * Subtitle controls
   */
  toggleSubtitles(): void {
    const video = this.videoElement.nativeElement;
    const tracks = video.textTracks;

    if (tracks.length > 0) {
      const track = tracks[0];
      if (track.mode === 'showing') {
        track.mode = 'hidden';
        this.subtitlesEnabled.set(false);
      } else {
        track.mode = 'showing';
        this.subtitlesEnabled.set(true);
      }
    }
  }

  /**
   * Fullscreen controls
   */
  toggleFullscreen(): void {
    if (this.playbackState().fullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  enterFullscreen(): void {
    const element = this.videoElement.nativeElement.parentElement;
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  /**
   * Picture-in-picture controls
   */
  supportsPiP(): boolean {
    return 'pictureInPictureEnabled' in document;
  }

  togglePictureInPicture(): void {
    const video = this.videoElement.nativeElement;

    if (this.playbackState().pictureInPicture) {
      document.exitPictureInPicture?.();
    } else {
      video.requestPictureInPicture?.();
    }
  }

  /**
   * Control visibility
   */
  showControlsTemporarily(): void {
    this.showControls.set(true);
    this.hideControlsAfterDelay();
  }

  hideControlsAfterDelay(): void {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
    }

    this.controlsTimer = window.setTimeout(() => {
      if (!this.playbackState().paused) {
        this.showControls.set(false);
      }
    }, 3000);
  }

  /**
   * Utility methods
   */
  formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getBufferedPercentage(): number {
    const video = this.videoElement.nativeElement;
    const buffered = video.buffered;

    if (buffered.length === 0) return 0;

    const currentTime = video.currentTime;
    let bufferedEnd = 0;

    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
        bufferedEnd = buffered.end(i);
        break;
      }
    }

    return video.duration > 0 ? (bufferedEnd / video.duration) * 100 : 0;
  }

  retry(): void {
    this.hasError.set(false);
    this.errorMessage.set('');
    this.isLoading.set(true);

    const video = this.videoElement.nativeElement;
    video.load();
  }

  /**
   * Update playback state
   */
  private updatePlaybackState(updates: Partial<PlaybackState>): void {
    const current = this.playbackState();
    const newState = { ...current, ...updates };
    this.playbackState.set(newState);
    this.playbackStateChange.emit(newState);
  }

  /**
   * Cleanup
   */
  private cleanup(): void {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
    }

    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
    }
  }
}