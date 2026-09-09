import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ContactLinkItem, TechnicalDoc } from '../../core/models/portfolio.models';

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
        
        <!-- Header -->
        <div class="contacts-header">
          <span class="contacts-badge">Contact Center & Architecture</span>
          <h1 class="contacts-title">Let's Build Something <span class="gradient-text">Amazing</span></h1>
          <p class="contacts-subtitle">
            Available for full-time opportunities, technical consulting, and innovative software development.
            Reach out through my contact channels or explore the technical documentation for this portfolio.
          </p>
        </div>

        <!-- Dynamic Contacts Grid -->
        <div class="contacts-grid">
          <ng-container *ngFor="let card of contactLinks()">
            <a [href]="card.url" 
               [target]="card.type === 'email' ? '_self' : '_blank'" 
               rel="noopener noreferrer" 
               class="contact-card"
               [title]="card.title + ': ' + (card.subtitle || '')">
              
              <div class="icon-box" [ngSwitch]="card.icon">
                <!-- Email Icon -->
                <svg *ngSwitchCase="'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>

                <!-- LinkedIn Icon -->
                <svg *ngSwitchCase="'linkedin'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>

                <!-- GitHub Icon -->
                <svg *ngSwitchCase="'github'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>

                <!-- WhatsApp Icon -->
                <svg *ngSwitchCase="'whatsapp'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.124.553 4.195 1.603 6.014L.069 24l6.143-1.579a11.98 11.98 0 005.819 1.498h.005c6.634 0 12.031-5.397 12.031-12.031 0-3.216-1.252-6.239-3.526-8.513C18.27 1.101 15.247 0 12.031 0zm0 22.012h-.004a9.97 9.97 0 01-5.086-1.391l-.365-.216-3.774.97.989-3.678-.237-.377a9.96 9.96 0 01-1.528-5.289c0-5.518 4.49-10.008 10.009-10.008 2.673 0 5.186 1.041 7.075 2.931a9.94 9.94 0 012.929 7.073c0 5.518-4.49 10.009-10.008 10.009z"/>
                </svg>

                <!-- Location Icon -->
                <svg *ngSwitchCase="'location'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>

                <!-- Default Custom Link Icon -->
                <svg *ngSwitchDefault viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>

              <div class="card-content">
                <h3>{{ card.title }}</h3>
                <p>{{ card.subtitle || card.url }}</p>
              </div>

              <div class="arrow-icon">→</div>
            </a>
          </ng-container>
        </div>

        <!-- Technical Documentation Showcase Card -->
        <div class="docs-showcase-card" *ngIf="featuredDoc(); let doc">
          <div class="doc-card-glow"></div>
          <div class="doc-badge-row">
            <span class="tech-pill">⚡ Technical Specs</span>
            <span class="tech-pill glass">Angular 17+</span>
            <span class="tech-pill glass">Signals</span>
            <span class="tech-pill glass">Cloud Sync</span>
          </div>

          <div class="doc-content-wrapper">
            <div class="doc-icon-large">{{ doc.icon || '📘' }}</div>
            <div class="doc-text-area">
              <h2 class="doc-headline">{{ doc.title }}</h2>
              <p class="doc-summary">{{ doc.summary }}</p>
              
              <div class="doc-tags-row">
                <span *ngFor="let tag of doc.tags" class="tag-chip">#{{ tag }}</span>
              </div>
            </div>
          </div>

          <div class="doc-actions-row">
            <button class="btn-read-doc" (click)="openDocViewer(doc)">
              <span>📖 View Architecture & Technical Documentation</span>
              <span class="btn-arrow">→</span>
            </button>
            <div class="doc-meta-info">
              <span>⏱️ Read time: {{ doc.estimatedReadTime || '12 min' }}</span>
              <span>📅 Updated: {{ doc.lastUpdated }}</span>
            </div>
          </div>
        </div>

        <!-- Direct Message CTA Section -->
        <div class="action-section">
          <p class="action-text">Prefer to compose and send a direct message right now?</p>
          <button (click)="openContactModal()" class="btn-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
            <span>Let's Talk / Send Message</span>
          </button>
        </div>

      </div>

      <!-- TECHNICAL DOCUMENTATION FULL MODAL VIEWER -->
      <div class="modal-backdrop" *ngIf="activeDoc()" (click)="closeDocViewer()">
        <div class="doc-modal-container" (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="doc-modal-header">
            <div class="modal-title-group">
              <div class="modal-doc-icon">{{ activeDoc()?.icon || '📘' }}</div>
              <div>
                <span class="modal-category">{{ activeDoc()?.category }}</span>
                <h2 class="modal-doc-title">{{ activeDoc()?.title }}</h2>
              </div>
            </div>
            <div class="modal-header-actions">
              <button class="btn-modal-action" (click)="copyDocContent()" title="Copy Documentation">
                {{ copyToast() ? '✅ Copied' : '📋 Copy' }}
              </button>
              <button class="btn-modal-action" (click)="printDoc()" title="Print / Export">
                🖨️ Print
              </button>
              <button class="btn-modal-close" (click)="closeDocViewer()" title="Close">✕</button>
            </div>
          </div>

          <!-- Document Selector (if multiple docs exist) -->
          <div class="doc-tabs-strip" *ngIf="technicalDocs().length > 1">
            <button *ngFor="let d of technicalDocs()" 
                    class="doc-tab-item" 
                    [class.active]="activeDoc()?.id === d.id"
                    (click)="activeDoc.set(d)">
              {{ d.icon || '📄' }} {{ d.title | slice:0:30 }}...
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="doc-modal-body">
            <div class="doc-meta-banner">
              <div class="meta-item">
                <span class="meta-label">Author:</span>
                <span class="meta-value">{{ activeDoc()?.author || 'Steven Piedra' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Last Updated:</span>
                <span class="meta-value">{{ activeDoc()?.lastUpdated }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Estimated Read Time:</span>
                <span class="meta-value">{{ activeDoc()?.estimatedReadTime || '15 min' }}</span>
              </div>
            </div>

            <!-- Formatted Markdown Document Rendering -->
            <div class="markdown-article" [innerHTML]="formatContent(activeDoc()?.content || '')"></div>
          </div>

          <!-- Modal Footer -->
          <div class="doc-modal-footer">
            <div class="footer-tags">
              <span *ngFor="let tag of activeDoc()?.tags" class="footer-tag">#{{ tag }}</span>
            </div>
            <button class="btn btn-secondary" (click)="closeDocViewer()">Close Document</button>
          </div>

        </div>
      </div>
    </main>
  `,
  styles: [`
    .contacts-page {
      position: relative;
      min-height: calc(100vh - var(--nav-height) - 150px);
      padding: 5rem 1.5rem 4rem 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    /* Background Blur Shapes */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(140px);
      z-index: -1;
      opacity: 0.45;
    }
    .shape-1 {
      top: -10%;
      left: -10%;
      width: 50vw;
      height: 50vw;
      background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%);
      animation: float 15s infinite ease-in-out alternate;
    }
    .shape-2 {
      bottom: -10%;
      right: -10%;
      width: 45vw;
      height: 45vw;
      background: radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%);
      animation: float 20s infinite ease-in-out alternate-reverse;
    }

    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(40px, 40px) rotate(12deg); }
    }

    .contacts-container {
      position: relative;
      z-index: 1;
      max-width: 960px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    /* Header */
    .contacts-header {
      text-align: center;
      max-width: 750px;
      margin: 0 auto;
    }

    .contacts-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #60A5FA;
      background: rgba(59,130,246,0.12);
      border: 1px solid rgba(59,130,246,0.3);
      padding: 0.4rem 1.1rem;
      border-radius: 100px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1.25rem;
    }

    .contacts-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 1rem;
      line-height: 1.15;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #C084FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .contacts-subtitle {
      font-size: 1.05rem;
      color: #94A3B8;
      line-height: 1.6;
    }

    /* Contacts Grid */
    .contacts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Contact Card */
    .contact-card {
      display: flex;
      align-items: center;
      padding: 1.35rem 1.25rem;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      text-decoration: none;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.15);
        background: rgba(30, 41, 59, 0.85);

        .icon-box {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: white;
          transform: scale(1.08);
        }
        
        .arrow-icon {
          transform: translateX(4px);
          opacity: 1;
          color: #60A5FA;
        }
      }
    }

    .icon-box {
      width: 46px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      color: #E2E8F0;
      margin-right: 1rem;
      transition: all 0.3s ease;
      flex-shrink: 0;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .card-content {
      flex: 1;
      min-width: 0;
      
      h3 {
        font-size: 0.95rem;
        font-weight: 600;
        color: #F8FAFC;
        margin: 0 0 0.2rem 0;
      }

      p {
        font-size: 0.82rem;
        color: #94A3B8;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .arrow-icon {
      font-size: 1.1rem;
      color: #64748B;
      opacity: 0.6;
      transition: all 0.3s;
    }

    /* ═══════════════════════════════════════════════
       TECHNICAL DOCUMENTATION SHOWCASE CARD
    ═══════════════════════════════════════════════ */
    .docs-showcase-card {
      position: relative;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      padding: 2.25rem;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(99, 102, 241, 0.1);
      overflow: hidden;
    }

    .doc-card-glow {
      position: absolute;
      top: -40px;
      right: -40px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .doc-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-bottom: 1.5rem;
    }

    .tech-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.8rem;
      border-radius: 100px;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.glass {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #CBD5E1;
      }
    }

    .doc-content-wrapper {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 1.75rem;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .doc-icon-large {
      font-size: 3rem;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .doc-headline {
      font-size: 1.35rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
    }

    .doc-summary {
      font-size: 0.95rem;
      color: #94A3B8;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .doc-tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag-chip {
      font-size: 0.78rem;
      color: #818CF8;
      background: rgba(99, 102, 241, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
    }

    .doc-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .btn-read-doc {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.6rem;
      background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
        background: linear-gradient(135deg, #4338CA 0%, #4F46E5 100%);

        .btn-arrow {
          transform: translateX(4px);
        }
      }

      .btn-arrow {
        transition: transform 0.25s ease;
      }
    }

    .doc-meta-info {
      display: flex;
      gap: 1.25rem;
      font-size: 0.85rem;
      color: #64748B;
      flex-wrap: wrap;
    }

    /* Action section */
    .action-section {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .action-text {
      font-size: 1.05rem;
      color: #94A3B8;
      margin-bottom: 1.25rem;
    }

    .btn-glow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.85rem 2.25rem;
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

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59,130,246,0.5);
        background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      }

      .btn-icon {
        width: 20px;
        height: 20px;
      }
    }

    /* ═══════════════════════════════════════════════
       MODAL VIEWER FOR TECHNICAL DOCUMENTATION
    ═══════════════════════════════════════════════ */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .doc-modal-container {
      background: #0B1120;
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 20px;
      width: 100%;
      max-width: 900px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    @keyframes slideUp {
      from { transform: translateY(30px) scale(0.97); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .doc-modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      background: rgba(15, 23, 42, 0.9);
    }

    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .modal-doc-icon {
      font-size: 2rem;
      background: rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .modal-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #818CF8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modal-doc-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0.15rem 0 0 0;
    }

    .modal-header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-modal-action {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #E2E8F0;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(99, 102, 241, 0.25);
        border-color: rgba(99, 102, 241, 0.5);
        color: white;
      }
    }

    .btn-modal-close {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #F87171;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(239, 68, 68, 0.3);
        color: white;
      }
    }

    .doc-tabs-strip {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      background: rgba(15, 23, 42, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      overflow-x: auto;
    }

    .doc-tab-item {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94A3B8;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;

      &.active {
        background: rgba(99, 102, 241, 0.2);
        border-color: #6366F1;
        color: #A5B4FC;
        font-weight: 600;
      }
    }

    .doc-modal-body {
      padding: 2rem;
      overflow-y: auto;
      color: #CBD5E1;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .doc-meta-banner {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 1rem 1.25rem;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .meta-item {
      display: flex;
      gap: 0.4rem;
      font-size: 0.85rem;
    }

    .meta-label {
      color: #64748B;
    }

    .meta-value {
      color: #E2E8F0;
      font-weight: 600;
    }

    /* Markdown article styles */
    .markdown-article {
      ::ng-deep h2 {
        font-size: 1.35rem;
        color: #F8FAFC;
        margin: 1.75rem 0 0.75rem 0;
        padding-bottom: 0.4rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      ::ng-deep h3 {
        font-size: 1.1rem;
        color: #93C5FD;
        margin: 1.25rem 0 0.5rem 0;
      }
      ::ng-deep p {
        margin: 0 0 1rem 0;
        color: #CBD5E1;
      }
      ::ng-deep ul, ::ng-deep ol {
        margin: 0 0 1.25rem 1.5rem;
        color: #CBD5E1;
      }
      ::ng-deep li {
        margin-bottom: 0.4rem;
      }
      ::ng-deep pre {
        background: #030712;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 1rem 1.25rem;
        overflow-x: auto;
        margin: 1rem 0 1.5rem 0;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.88rem;
        color: #38BDF8;
      }
      ::ng-deep code {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
        color: #A5B4FC;
      }
      ::ng-deep pre code {
        background: transparent;
        padding: 0;
        color: inherit;
      }
      ::ng-deep hr {
        border: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 2rem 0;
      }
    }

    .doc-modal-footer {
      padding: 1.25rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.9);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .footer-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .footer-tag {
      font-size: 0.78rem;
      color: #818CF8;
      background: rgba(99, 102, 241, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: white;
      padding: 0.5rem 1.2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  `]
})
export class ContactsComponent {
  private contactService = inject(ContactService);
  private portfolioService = inject(PortfolioService);

  activeDoc = signal<TechnicalDoc | null>(null);
  copyToast = signal<boolean>(false);

  get contactLinks() {
    return this.portfolioService.contactLinksSignal;
  }

  get technicalDocs() {
    return this.portfolioService.technicalDocsSignal;
  }

  featuredDoc(): TechnicalDoc | undefined {
    const docs = this.technicalDocs();
    return docs.find(d => d.isFeatured) || docs[0];
  }

  openContactModal() {
    this.contactService.openModal();
  }

  openDocViewer(doc: TechnicalDoc) {
    this.activeDoc.set(doc);
  }

  closeDocViewer() {
    this.activeDoc.set(null);
  }

  copyDocContent() {
    const doc = this.activeDoc();
    if (!doc) return;

    const fullText = `# ${doc.title}\n\nCategory: ${doc.category}\nLast Updated: ${doc.lastUpdated}\n\n${doc.summary}\n\n${doc.content}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        this.copyToast.set(true);
        setTimeout(() => this.copyToast.set(false), 2000);
      });
    }
  }

  printDoc() {
    window.print();
  }

  formatContent(content: string): string {
    if (!content) return '';
    
    // Convert code blocks
    let formatted = content.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert headings
    formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Convert bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet lists
    formatted = formatted.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Convert horizontal rules
    formatted = formatted.replace(/^---$/gim, '<hr>');

    // Convert paragraphs
    formatted = formatted.replace(/\n\n+/g, '<br><br>');

    return formatted;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
