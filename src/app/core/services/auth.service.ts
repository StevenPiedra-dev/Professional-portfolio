import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'portfolio_admin_auth';
  isAuthenticated = signal<boolean>(this.checkInitialAuth());

  private checkInitialAuth(): boolean {
    try {
      return sessionStorage.getItem(this.AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    if (username.trim() === 'Admin' && password === 'Anton1oP1V2!') {
      try {
        sessionStorage.setItem(this.AUTH_KEY, 'true');
      } catch {}
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    try {
      sessionStorage.removeItem(this.AUTH_KEY);
    } catch {}
    this.isAuthenticated.set(false);
  }
}
