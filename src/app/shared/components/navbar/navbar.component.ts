import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About me', path: '/about' },
    { label: 'All my projects', path: '/projects' },
    { label: 'My blog', path: '/blog' },
    { label: 'My contacts', path: '/contacts' }
  ];

  constructor(public contactService: ContactService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openContactModal() {
    this.closeMenu();
    this.contactService.openModal();
  }
}
