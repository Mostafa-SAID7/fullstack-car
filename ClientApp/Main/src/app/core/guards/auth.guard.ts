import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.currentUser;
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check if user has required roles (can be extended)
    if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}