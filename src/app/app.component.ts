import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ContactModalComponent } from './shared/components/contact-modal/contact-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ContactModalComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main class="main-layout-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-contact-modal></app-contact-modal>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-main, #0B0F17);
      color: var(--text-primary, #F8FAFC);
    }
    .main-layout-content {
      padding-top: var(--nav-height, 80px);
      min-height: calc(100vh - 200px);
    }
  `]
})
export class AppComponent {
  title = 'Steven Piedra | Portfolio';
}
