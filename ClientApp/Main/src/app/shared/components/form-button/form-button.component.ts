import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-form-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss']
})
export class FormButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon = '';
  @Input() fullWidth = false;
  @Input() rounded = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 focus:ring-blue-500 shadow-sm hover:shadow-md',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 focus:ring-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm hover:shadow-md'
    };

    const sizeClasses = {
      xs: 'h-7 px-2 text-xs gap-1',
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 py-2 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      xl: 'h-14 px-8 text-lg gap-3'
    };

    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-lg';
    const fullWidthClass = this.fullWidth ? 'w-full' : '';

    return [
      baseClasses,
      variantClasses[this.variant],
      sizeClasses[this.size],
      roundedClass,
      fullWidthClass
    ].join(' ');
  }
}