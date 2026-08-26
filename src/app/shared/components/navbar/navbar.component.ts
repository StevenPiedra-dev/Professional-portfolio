import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ContactModalService } from '../../../core/services/contact-modal.service';
import { AdminLoginModalComponent } from '../../../features/admin/admin-login-modal.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLoginModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private modalService = inject(ContactModalService);
  private router = inject(Router);
  private authService = inject(AuthService);

  isMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  showAdminLogin = signal<boolean>(false);

  private logoClickCount = 0;
  private logoClickTimer: any = null;

  // Tab mapping: nav label -> admin tab id
  private adminTabMap: Record<string, string> = {
    '/': 'metrics',
    '/about': 'about',
    '/projects': 'projects',
    '/blog': 'blog',
    '/contacts': 'contact'
  };

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About me', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contacts' }
  ];

  get isAdmin(): boolean {
    return this.authService.isAuthenticated();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  onLogoClick(event: MouseEvent) {
    this.logoClickCount++;

    if (this.logoClickTimer) {
      clearTimeout(this.logoClickTimer);
    }

    if (this.logoClickCount >= 3) {
      event.preventDefault();
      event.stopPropagation();
      this.logoClickCount = 0;

      if (this.isAdmin) {
        // Admin triple-click: toggle back to user view (logout)
        this.authService.logout();
        this.router.navigate(['/']);
      } else {
        // Guest triple-click: open admin login modal
        this.showAdminLogin.set(true);
      }
      return;
    }

    this.logoClickTimer = setTimeout(() => {
      this.logoClickCount = 0;
    }, 1500);
  }

  onNavLinkClick(event: MouseEvent, path: string) {
    if (this.isAdmin) {
      event.preventDefault();
      event.stopPropagation();
      const tab = this.adminTabMap[path] || 'metrics';
      this.router.navigate(['/admin'], { queryParams: { tab } });
      this.closeMenu();
    } else {
      this.closeMenu();
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openContactModal() {
    if (this.isAdmin) {
      this.router.navigate(['/admin'], { queryParams: { tab: 'contact' } });
      this.closeMenu();
    } else {
      this.closeMenu();
      this.modalService.openModal();
    }
  }
}
