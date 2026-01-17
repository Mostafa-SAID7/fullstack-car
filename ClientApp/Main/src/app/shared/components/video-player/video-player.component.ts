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
  template: `
    <div 
      class="video-player relative bg-black rounded-lg overflow-hidden"
      [class.fullscreen]="playbackState().fullscreen"
      (keydown)="handleKeyboardShortcut($event)"
      tabindex="0"
    >
      <!-- Video Element -->
      <video
        #videoElement
        class="w-full h-full object-contain"
        [src]="currentSource()?.src"
        [autoplay]="config().autoplay"
        [muted]="config().muted"
        [loop]="config().loop"
        [preload]="config().preload"
        [controls]="false"
        (loadedmetadata)="onLoadedMetadata()"
        (timeupdate)="onTimeUpdate()"
        (play)="onPlay()"
        (pause)="onPause()"
        (ended)="onEnded()"
        (volumechange)="onVolumeChange()"
        (ratechange)="onRateChange()"
        (error)="onError($event)"
        (click)="togglePlayPause()"
      >
        <!-- Video Sources -->
        <source 
          *ngFor="let source of videoSources()" 
          [src]="source.src" 
          [type]="source.type"
        >
        
        <!-- Text Tracks -->
        <track 
          *ngFor="let track of videoTracks()" 
          [kind]="track.kind"
          [src]="track.src"
          [srclang]="track.srclang"
          [label]="track.label"
          [default]="track.default"
        >
        
        Your browser does not support the video tag.
      </video>

      <!-- Loading Spinner -->
      <div 
        *ngIf="isLoading()"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>

      <!-- Controls Overlay -->
      <div 
        class="controls-overlay absolute inset-0 flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity duration-300"
        [class.opacity-100]="showControls() || !playbackState().paused"
        (mousemove)="showControlsTemporarily()"
        (mouseleave)="hideControlsAfterDelay()"
      >
        <!-- Center Play Button -->
        <div 
          *ngIf="playbackState().paused && !isLoading()"
          class="absolute inset-0 flex items-center justify-center"
        >
          <button 
            (click)="play()"
            class="play-button bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-200"
            aria-label="Play video"
          >
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container px-4 pb-2">
          <div class="progress-bar relative">
            <!-- Buffer Progress -->
            <div class="buffer-progress absolute inset-0 bg-white bg-opacity-30 rounded-full h-1">
              <div 
                class="buffer-fill bg-white bg-opacity-50 h-full rounded-full transition-all duration-200"
                [style.width.%]="getBufferedPercentage()"
              ></div>
            </div>
            
            <!-- Playback Progress -->
            <input
              type="range"
              class="progress-input absolute inset-0 w-full h-1 bg-transparent appearance-none cursor-pointer"
              [min]="0"
              [max]="playbackState().duration || 0"
              [value]="playbackState().currentTime"
              (input)="seekTo($event)"
              (mousedown)="startSeeking()"
              (mouseup)="stopSeeking()"
              aria-label="Video progress"
            >
          </div>
        </div>

        <!-- Control Bar -->
        <div class="control-bar bg-gradient-to-t from-black to-transparent p-4">
          <div class="flex items-center justify-between">
            <!-- Left Controls -->
            <div class="flex items-center space-x-4">
              <!-- Play/Pause Button -->
              <button 
                (click)="togglePlayPause()"
                class="control-button text-white hover:text-gray-300 transition-colors"
                [attr.aria-label]="playbackState().paused ? 'Play' : 'Pause'"
              >
                <svg *ngIf="playbackState().paused" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
                <svg *ngIf="!playbackState().paused" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </button>

              <!-- Volume Control -->
              <div class="volume-control flex items-center space-x-2">
                <button 
                  (click)="toggleMute()"
                  class="control-button text-white hover:text-gray-300 transition-colors"
                  [attr.aria-label]="playbackState().muted ? 'Unmute' : 'Mute'"
                >
                  <svg *ngIf="!playbackState().muted && playbackState().volume > 0.5" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12 6a1 1 0 011.414 0L15 7.586l1.586-1.586A1 1 0 1118 7.414L16.414 9 18 10.586A1 1 0 0116.586 12L15 10.414 13.414 12A1 1 0 0112 10.586L13.586 9 12 7.414A1 1 0 0112 6z" clip-rule="evenodd"></path>
                  </svg>
                  <svg *ngIf="!playbackState().muted && playbackState().volume <= 0.5 && playbackState().volume > 0" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  <svg *ngIf="playbackState().muted || playbackState().volume === 0" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                
                <input
                  type="range"
                  class="volume-slider w-20 h-1 bg-white bg-opacity-30 rounded-full appearance-none cursor-pointer"
                  [min]="0"
                  [max]="1"
                  [step]="0.1"
                  [value]="playbackState().volume"
                  (input)="setVolume($event)"
                  aria-label="Volume"
                >
              </div>

              <!-- Time Display -->
              <div class="time-display text-white text-sm font-mono">
                {{ formatTime(playbackState().currentTime) }} / {{ formatTime(playbackState().duration) }}
              </div>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center space-x-4">
              <!-- Playback Rate -->
              <div class="playback-rate relative" *ngIf="config().playbackRates.length > 1">
                <button 
                  (click)="togglePlaybackRateMenu()"
                  class="control-button text-white hover:text-gray-300 transition-colors text-sm"
                  aria-label="Playback speed"
                >
                  {{ playbackState().playbackRate }}x
                </button>
                
                <div 
                  *ngIf="showPlaybackRateMenu()"
                  class="playback-rate-menu absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-lg p-2 min-w-20"
                >
                  <button
                    *ngFor="let rate of config().playbackRates"
                    (click)="setPlaybackRate(rate)"
                    class="block w-full text-left px-3 py-1 text-white hover:bg-white hover:bg-opacity-20 rounded text-sm"
                    [class.bg-white]="playbackState().playbackRate === rate"
                    [class.bg-opacity-20]="playbackState().playbackRate === rate"
                  >
                    {{ rate }}x
                  </button>
                </div>
              </div>

              <!-- Quality Selector -->
              <div class="quality-selector relative" *ngIf="config().enableQualitySelector && videoSources().length > 1">
                <button 
                  (click)="toggleQualityMenu()"
                  class="control-button text-white hover:text-gray-300 transition-colors text-sm"
                  aria-label="Video quality"
                >
                  {{ currentSource()?.quality || 'Auto' }}
                </button>
                
                <div 
                  *ngIf="showQualityMenu()"
                  class="quality-menu absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-lg p-2 min-w-20"
                >
                  <button
                    *ngFor="let source of videoSources()"
                    (click)="setQuality(source)"
                    class="block w-full text-left px-3 py-1 text-white hover:bg-white hover:bg-opacity-20 rounded text-sm"
                    [class.bg-white]="currentSource()?.quality === source.quality"
                    [class.bg-opacity-20]="currentSource()?.quality === source.quality"
                  >
                    {{ source.quality }}
                  </button>
                </div>
              </div>

              <!-- Subtitles -->
              <button 
                *ngIf="config().enableSubtitles && videoTracks().length > 0"
                (click)="toggleSubtitles()"
                class="control-button text-white hover:text-gray-300 transition-colors"
                [class.text-blue-400]="subtitlesEnabled()"
                aria-label="Toggle subtitles"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zm2-1v1h2V3H9zM6 6H4v8h12V6H6z" clip-rule="evenodd"></path>
                </svg>
              </button>

              <!-- Picture in Picture -->
              <button 
                *ngIf="config().enablePictureInPicture && supportsPiP()"
                (click)="togglePictureInPicture()"
                class="control-button text-white hover:text-gray-300 transition-colors"
                [class.text-blue-400]="playbackState().pictureInPicture"
                aria-label="Picture in picture"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v7h12V5H4zm8 8a1 1 0 011-1h3a1 1 0 011 1v2a1 1 0 01-1 1h-3a1 1 0 01-1-1v-2z"></path>
                </svg>
              </button>

              <!-- Fullscreen -->
              <button 
                *ngIf="config().enableFullscreen"
                (click)="toggleFullscreen()"
                class="control-button text-white hover:text-gray-300 transition-colors"
                [attr.aria-label]="playbackState().fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
              >
                <svg *ngIf="!playbackState().fullscreen" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                <svg *ngIf="playbackState().fullscreen" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 2a1 1 0 000 2H6.414l1.293 1.293a1 1 0 11-1.414 1.414L5 5.414V7a1 1 0 01-2 0V3a1 1 0 011-1h4zm4 0a1 1 0 011 1v4a1 1 0 01-2 0V5.414l-1.293 1.293a1 1 0 11-1.414-1.414L9.586 4H8a1 1 0 010-2h4zM2 12a1 1 0 011-1h4a1 1 0 010 2H5.414l1.293 1.293a1 1 0 11-1.414 1.414L4 14.414V16a1 1 0 01-2 0v-4zm11 1a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-2 0v-1.586l-1.293 1.293a1 1 0 11-1.414-1.414L16.586 15H15a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div 
        *ngIf="hasError()"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div class="text-center text-white p-6">
          <svg class="w-12 h-12 mx-auto mb-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <h3 class="text-lg font-semibold mb-2">Video Error</h3>
          <p class="text-sm text-gray-300">{{ errorMessage() }}</p>
          <button 
            (click)="retry()"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  `,
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
  private playbackState = signal<PlaybackState>({
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

  private currentSource = signal<VideoSource | null>(null);
  private isLoading = signal(false);
  private hasError = signal(false);
  private errorMessage = signal('');
  private showControls = signal(true);
  private showPlaybackRateMenu = signal(false);
  private showQualityMenu = signal(false);
  private subtitlesEnabled = signal(false);
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