import { Injectable, signal } from '@angular/core';

/**
 * Icon Registry Service
 * Manages icon aliases and provides centralized icon access
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconRegistry = new Map<string, string>();
  private registeredIcons = signal<string[]>([]);

  constructor() {
    this.registerCommonIcons();
  }

  private registerCommonIcons(): void {
    // Media icons
    this.registerIcon('play', 'play-circle');
    this.registerIcon('pause', 'pause-circle');
    this.registerIcon('stop', 'stop-circle');
    this.registerIcon('volume', 'volume-high');
    this.registerIcon('volume-mute', 'volume-x');
    this.registerIcon('video', 'video');
    this.registerIcon('podcast', 'microphone');
    
    // Navigation icons
    this.registerIcon('home', 'home-01');
    this.registerIcon('search', 'search-01');
    this.registerIcon('menu', 'menu-01');
    this.registerIcon('close', 'cancel-01');
    this.registerIcon('back', 'arrow-left-01');
    this.registerIcon('forward', 'arrow-right-01');
    
    // Social icons
    this.registerIcon('like', 'heart');
    this.registerIcon('like-filled', 'heart-filled');
    this.registerIcon('share', 'share-01');
    this.registerIcon('comment', 'message-circle-01');
    this.registerIcon('bookmark', 'bookmark-01');
    this.registerIcon('bookmark-filled', 'bookmark-filled');
    
    // User icons
    this.registerIcon('user', 'user');
    this.registerIcon('users', 'users-01');
    this.registerIcon('profile', 'user-circle');
    this.registerIcon('settings', 'settings-01');
    this.registerIcon('logout', 'logout-01');
    
    // System icons
    this.registerIcon('loading', 'loading-01');
    this.registerIcon('error', 'alert-circle');
    this.registerIcon('success', 'check-circle');
    this.registerIcon('warning', 'alert-triangle');
    this.registerIcon('info', 'information-circle');
    
    // Theme icons
    this.registerIcon('sun', 'sun-01');
    this.registerIcon('moon', 'moon-01');
    this.registerIcon('theme', 'palette');
    
    // Communication icons
    this.registerIcon('notification', 'notification-01');
    this.registerIcon('bell', 'notification-02');
    this.registerIcon('message', 'message-01');
    this.registerIcon('chat', 'chat-01');
    this.registerIcon('email', 'mail-01');
    
    // Marketplace icons
    this.registerIcon('store', 'store-01');
    this.registerIcon('cart', 'shopping-cart-01');
    this.registerIcon('product', 'package');
    this.registerIcon('price', 'dollar-circle');
    
    // Community icons
    this.registerIcon('group', 'user-group');
    this.registerIcon('post', 'file-02');
    this.registerIcon('forum', 'message-square-01');
    
    // Action icons
    this.registerIcon('add', 'add-circle');
    this.registerIcon('edit', 'edit-02');
    this.registerIcon('delete', 'delete-02');
    this.registerIcon('save', 'save-01');
    this.registerIcon('cancel', 'cancel-circle');
    this.registerIcon('check', 'check');
    
    // File icons
    this.registerIcon('file', 'file-01');
    this.registerIcon('folder', 'folder-01');
    this.registerIcon('download', 'download-01');
    this.registerIcon('upload', 'upload-01');
    
    // Update registered icons signal
    this.registeredIcons.set(Array.from(this.iconRegistry.keys()));
  }

  /**
   * Get icon name by alias
   */
  getIcon(alias: string): string {
    return this.iconRegistry.get(alias) || alias;
  }

  /**
   * Register a new icon alias
   */
  registerIcon(alias: string, iconName: string): void {
    this.iconRegistry.set(alias, iconName);
    this.registeredIcons.set(Array.from(this.iconRegistry.keys()));
  }

  /**
   * Check if an icon alias exists
   */
  hasIcon(alias: string): boolean {
    return this.iconRegistry.has(alias);
  }

  /**
   * Get all registered icon aliases
   */
  getRegisteredIcons(): string[] {
    return Array.from(this.iconRegistry.keys());
  }

  /**
   * Get registered icons as signal
   */
  getRegisteredIconsSignal() {
    return this.registeredIcons.asReadonly();
  }
}
