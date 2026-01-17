import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'bars';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() size: LoadingSize = 'md';
  @Input() variant: LoadingVariant = 'spinner';
  @Input() text = '';
  @Input() fullScreen = false;
  @Input() overlay = false;

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center justify-center';
    const sizeClasses = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5'
    };

    const classes = [baseClasses, sizeClasses[this.size]];

    if (this.fullScreen) {
      classes.push('fixed inset-0 z-50 bg-white/80 backdrop-blur-sm');
    } else if (this.overlay) {
      classes.push('absolute inset-0 z-10 bg-white/60 backdrop-blur-sm rounded-lg');
    }

    return classes.join(' ');
  }

  get iconClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    return `text-blue-600 ${sizeClasses[this.size]}`;
  }

  get textClasses(): string {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    return `text-gray-600 animate-pulse ${sizeClasses[this.size]}`;
  }

  get dotSize(): string {
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };

    return sizeClasses[this.size];
  }

  get barWidth(): string {
    const sizeClasses = {
      xs: 'w-1',
      sm: 'w-1.5',
      md: 'w-2',
      lg: 'w-3',
      xl: 'w-4'
    };

    return sizeClasses[this.size];
  }

  get barHeight(): string {
    const sizeClasses = {
      xs: '12px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px'
    };

    return sizeClasses[this.size];
  }
}