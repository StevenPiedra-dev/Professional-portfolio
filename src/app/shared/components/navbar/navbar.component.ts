import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactModalService } from '../../../core/services/contact-modal.service';
import { AdminLoginModalComponent } from '../../../features/admin/admin-login-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLoginModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private modalService = inject(ContactModalService);

  isMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  showAdminLogin = signal<boolean>(false);

  private logoClickCount = 0;
  private logoClickTimer: any = null;

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About me', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contacts' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  onLogoClick(event: MouseEvent) {
    // Increment click counter for secret admin access
    this.logoClickCount++;

    if (this.logoClickTimer) {
      clearTimeout(this.logoClickTimer);
    }

    if (this.logoClickCount >= 3) {
      event.preventDefault();
      event.stopPropagation();
      this.logoClickCount = 0;
      this.showAdminLogin.set(true);
      return;
    }

    this.logoClickTimer = setTimeout(() => {
      this.logoClickCount = 0;
    }, 1500);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openContactModal() {
    this.closeMenu();
    this.modalService.openModal();
  }
}
