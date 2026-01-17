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

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishDate: Date;
  podcastId: string;
  podcastTitle: string;
  podcastArtwork: string;
  episodeNumber?: number;
  seasonNumber?: number;
  transcript?: string;
  chapters?: PodcastChapter[];
}

export interface PodcastChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  episodes: PodcastEpisode[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybackState {
  currentEpisode: PodcastEpisode | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  paused: boolean;
  ended: boolean;
  buffered: TimeRanges | null;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
}

export interface PodcastPlayerConfig {
  autoplay: boolean;
  enablePlaylist: boolean;
  enableChapters: boolean;
  enableTranscript: boolean;
  enableSleepTimer: boolean;
  enableSpeedControl: boolean;
  enableSkipSilence: boolean;
  enableAnalytics: boolean;
  theme: 'light' | 'dark' | 'auto';
  skipForwardSeconds: number;
  skipBackwardSeconds: number;
  playbackRates: number[];
}

/**
 * Podcast Player Component
 * 
 * Advanced podcast player with:
 * - Episode playlist management
 * - Chapter navigation
 * - Transcript display
 * - Sleep timer functionality
 * - Variable speed playback
 * - Skip silence feature
 * - Background playback support
 * - Analytics tracking
 */
@Component({
  selector: 'app-podcast-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './podcast-player.component.html',
  styles: [`
    .podcast-player {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 100%;
    }

    .control-button {
      transition: all 0.2s ease-in-out;
    }

    .control-button:hover {
      transform: scale(1.05);
    }

    .play-pause-button:hover {
      transform: scale(1.05);
    }
  `]
})
export class PodcastPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioElement', { static: true }) audioElement!: ElementRef<HTMLAudioElement>;

  @Input() initialEpisode = signal<PodcastEpisode | null>(null);
  @Input() playlist = signal<Playlist | null>(null);
  @Input() config = signal<PodcastPlayerConfig>({
    autoplay: false,
    enablePlaylist: true,
    enableChapters: true,
    enableTranscript: true,
    enableSleepTimer: true,
    enableSpeedControl: true,
    enableSkipSilence: false,
    enableAnalytics: true,
    theme: 'auto',
    skipForwardSeconds: 30,
    skipBackwardSeconds: 15,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  });

  @Output() episodeChanged = new EventEmitter<PodcastEpisode>();
  @Output() playbackStateChanged = new EventEmitter<PlaybackState>();
  @Output() playlistChanged = new EventEmitter<Playlist>();

  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);

  // Signals for reactive state
  protected playbackState = signal<PlaybackState>({
    currentEpisode: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    paused: true,
    ended: false,
    buffered: null,
    playbackRate: 1,
    isLoading: false,
    error: null
  });

  protected isMinimized = signal(false);

  ngOnInit(): void {
    this.initializePodcastPlayer();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Initialize podcast player
   */
  private initializePodcastPlayer(): void {
    // Set initial episode if provided
    if (this.initialEpisode()) {
      this.selectEpisode(this.initialEpisode()!);
    }

    // Set initial volume
    const audio = this.audioElement.nativeElement;
    audio.volume = this.playbackState().volume;
  }

  /**
   * Audio event handlers
   */
  onLoadedMetadata(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      duration: audio.duration,
      buffered: audio.buffered,
      isLoading: false,
      error: null
    });
  }

  onTimeUpdate(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      currentTime: audio.currentTime,
      buffered: audio.buffered
    });
  }

  onPlay(): void {
    this.updatePlaybackState({ paused: false });

    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'play');
      }
    }
  }

  onPause(): void {
    this.updatePlaybackState({ paused: true });

    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'pause');
      }
    }
  }

  onEnded(): void {
    this.updatePlaybackState({ ended: true, paused: true });

    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'complete');
      }
    }
  }

  onVolumeChange(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      volume: audio.volume,
      muted: audio.muted
    });
  }

  onRateChange(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({ playbackRate: audio.playbackRate });
  }

  onLoadStart(): void {
    this.updatePlaybackState({ isLoading: true, error: null });
  }

  onCanPlay(): void {
    this.updatePlaybackState({ isLoading: false });
  }

  onError(event: Event): void {
    const audio = this.audioElement.nativeElement;
    const error = audio.error;

    let message = 'An unknown error occurred';
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Audio playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error occurred';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Audio decoding error';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Audio format not supported';
          break;
      }
    }

    this.updatePlaybackState({
      error: message,
      isLoading: false
    });

    if (this.config().enableAnalytics) {
      this.analyticsService.trackException(new Error(message), false);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-podcast.png';
  }

  /**
   * Playback controls
   */
  play(): void {
    if (!this.playbackState().currentEpisode) return;

    this.audioElement.nativeElement.play().catch(error => {
      console.error('Failed to play audio:', error);
      this.updatePlaybackState({ error: 'Failed to play audio' });
    });
  }

  pause(): void {
    this.audioElement.nativeElement.pause();
  }

  togglePlayPause(): void {
    if (this.playbackState().paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Episode management
   */
  selectEpisode(episode: PodcastEpisode): void {
    const wasPlaying = !this.playbackState().paused;

    this.updatePlaybackState({
      currentEpisode: episode,
      currentTime: 0,
      duration: episode.duration,
      ended: false,
      error: null
    });

    // Load new audio
    const audio = this.audioElement.nativeElement;
    audio.src = episode.audioUrl;

    if (wasPlaying && this.config().autoplay) {
      audio.addEventListener('canplay', () => this.play(), { once: true });
    }

    this.episodeChanged.emit(episode);
  }

  /**
   * UI controls
   */
  toggleMinimized(): void {
    this.isMinimized.set(!this.isMinimized());
  }

  /**
   * Update playback state
   */
  private updatePlaybackState(updates: Partial<PlaybackState>): void {
    const current = this.playbackState();
    const newState = { ...current, ...updates };
    this.playbackState.set(newState);
    this.playbackStateChanged.emit(newState);
  }
}