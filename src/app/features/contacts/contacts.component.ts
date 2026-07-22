import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="subpage-container">
      <div class="subpage-header">
        <span class="subpage-badge">Contacto</span>
        <h1>My contacts</h1>
        <p class="subpage-subtitle">¿Tienes una propuesta o proyecto en mente? ¡Conéctate conmigo!</p>

        <div class="contacts-card">
          <div class="contact-item">
            <span class="label">Email de contacto:</span>
            <a [href]="'mailto:' + email" class="link">{{ email }}</a>
          </div>
          <div class="contact-item">
            <span class="label">LinkedIn:</span>
            <a href="https://www.linkedin.com/in/stevenpiedra/" target="_blank" class="link">linkedin.com/in/stevenpiedra</a>
          </div>
          <div class="contact-item">
            <span class="label">GitHub:</span>
            <a href="https://github.com/StevenPiedra-devv" target="_blank" class="link">github.com/StevenPiedra-devv</a>
          </div>

          <div class="card-action">
            <button (click)="openContactModal()" class="btn-primary">
              Enviar propuesta directa via "Let's talk"
            </button>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .subpage-container {
      min-height: calc(100vh - var(--nav-height) - 150px);
      padding: 6rem 1.5rem 4rem 1.5rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .subpage-header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { font-size: 2.5rem; color: #FFF; margin: 0.5rem 0; }
      .subpage-badge {
        font-size: 0.8rem; font-weight: 600; color: var(--blue-400);
        background: rgba(59,130,246,0.12); padding: 0.3rem 0.8rem; border-radius: 100px;
      }
      .subpage-subtitle { color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem auto; }
    }
    .contacts-card {
      background: #162238;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 550px;
      margin: 0 auto;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--shadow-md);
    }
    .contact-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      .label { font-size: 0.85rem; color: var(--text-muted); }
      .link { color: var(--blue-400); font-weight: 600; font-size: 1.05rem; }
    }
    .card-action {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
      .btn-primary {
        background: var(--blue-gradient);
        color: #FFF;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35);
        cursor: pointer;
        &:hover { transform: translateY(-2px); }
      }
    }
  `]
})
export class ContactsComponent {
  email = 'steven.piedra02@gmail.com';

  constructor(private contactService: ContactService) {}

  openContactModal() {
    this.contactService.openModal();
  }
}
