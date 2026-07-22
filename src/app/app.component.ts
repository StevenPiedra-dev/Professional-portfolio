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
    <div class="main-layout-content">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
    <app-contact-modal></app-contact-modal>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-main);
      color: var(--text-primary);
    }
    .main-layout-content {
      padding-top: var(--nav-height);
      min-height: calc(100vh - 200px);
    }
  `]
})
export class AppComponent {
  title = 'portfolio-steven-piedra';
}
