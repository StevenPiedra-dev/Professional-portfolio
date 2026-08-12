import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="contacts-page">
      <!-- Background Elements -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      
      <div class="contacts-container">
        <div class="contacts-header">
          <span class="contacts-badge">Get In Touch</span>
          <h1 class="contacts-title">Let's Build Something <span class="gradient-text">Amazing</span></h1>
          <p class="contacts-subtitle">I'm currently available for full-time opportunities and freelance projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
        </div>

        <div class="contacts-grid">
          <!-- Email Card -->
          <a [href]="'mailto:' + email" class="contact-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="card-content">
              <h3>Email</h3>
              <p>{{ email }}</p>
            </div>
            <div class="arrow-icon">→</div>
          </a>

          <!-- LinkedIn Card -->
          <a href="https://www.linkedin.com/in/stevenpiedra/" target="_blank" class="contact-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>LinkedIn</h3>
              <p>stevenpiedra</p>
            </div>
            <div class="arrow-icon">→</div>
          </a>

          <!-- GitHub Card -->
          <a href="https://github.com/StevenPiedra-dev" target="_blank" class="contact-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>GitHub</h3>
              <p>StevenPiedra-dev</p>
            </div>
            <div class="arrow-icon">→</div>
          </a>
        </div>

        <div class="action-section">
          <p class="action-text">Prefer to send a direct message right now?</p>
          <button (click)="openContactModal()" class="btn-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
            Let's Talk
          </button>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .contacts-page {
      position: relative;
      min-height: calc(100vh - var(--nav-height) - 150px);
      padding: 6rem 1.5rem 4rem 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    /* Background Blur Shapes */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      z-index: -1;
      opacity: 0.5;
    }
    .shape-1 {
      top: -10%;
      left: -10%;
      width: 50vw;
      height: 50vw;
      background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
      animation: float 15s infinite ease-in-out alternate;
    }
    .shape-2 {
      bottom: -10%;
      right: -10%;
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
      animation: float 20s infinite ease-in-out alternate-reverse;
    }

    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(50px, 50px) rotate(15deg); }
    }

    .contacts-container {
      position: relative;
      z-index: 1;
      max-width: 900px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }

    /* Header */
    .contacts-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }

    .contacts-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--blue-400);
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      padding: 0.4rem 1rem;
      border-radius: 100px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
    }

    .contacts-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 1.25rem;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .contacts-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Grid layout */
    .contacts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Contact Card Glassmorphism */
    .contact-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      text-decoration: none;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        transform: translateY(-5px);
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(59, 130, 246, 0.1);
        background: rgba(30, 41, 59, 0.8);

        &::before { opacity: 1; }

        .icon-box {
          background: var(--blue-500);
          color: white;
          transform: scale(1.1);
        }
        
        .arrow-icon {
          transform: translateX(5px);
          opacity: 1;
          color: var(--blue-400);
        }
      }
    }

    .icon-box {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      color: var(--text-primary);
      margin-right: 1.25rem;
      transition: all 0.3s ease;
      flex-shrink: 0;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .card-content {
      flex: 1;
      min-width: 0;
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #F8FAFC;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .arrow-icon {
      font-size: 1.2rem;
      color: var(--text-muted);
      opacity: 0.5;
      transition: all 0.3s;
    }

    /* Call to action section */
    .action-section {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .action-text {
      font-size: 1.05rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .btn-glow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.85rem 2rem;
      background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
      color: #FFF;
      border-radius: 12px;
      font-size: 1.05rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(59,130,246,0.3);

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
        transform: translateX(-100%);
        transition: transform 0.5s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59,130,246,0.5);
        background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);

        &::after {
          transform: translateX(100%);
        }
      }

      .btn-icon {
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class ContactsComponent {
  email = 'steven.piedra02@gmail.com';
  private contactService = inject(ContactService);

  openContactModal() {
    this.contactService.openModal();
  }
}
