import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()" role="dialog" aria-modal="true" *ngIf="project">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Close button -->
        <button class="close-btn" (click)="closeModal()" aria-label="Cerrar ventana">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Visual Header -->
        <div class="modal-header-bg" [style.background]="getGradient()">
          <span class="modal-icon">{{ getProjectIcon() }}</span>
          <div class="modal-header-overlay"></div>
          <div class="modal-stars-badge" *ngIf="project.stars">
            ⭐ {{ project.stars }} Stars
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="modal-meta-row">
            <span class="modal-tag" *ngIf="project.category">{{ project.category | uppercase }}</span>
            <span class="modal-year" *ngIf="project.year">{{ project.year }}</span>
          </div>

          <h2 class="modal-title">{{ project.title }}</h2>

          <div class="modal-section">
            <h3>Overview</h3>
            <p class="modal-description">{{ project.longDescription || project.description }}</p>
          </div>

          <div class="modal-section">
            <h3>Tech Stack</h3>
            <div class="tech-grid">
              <span *ngFor="let tech of project.technologies" class="tech-chip-lg">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <a *ngIf="project.liveUrl" [href]="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn btn-live">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ver Live Demo
            </a>

            <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-github">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Código en GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(8, 15, 30, 0.82);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      position: relative;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 20px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      color: #F8FAFC;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(239, 68, 68, 0.8);
        border-color: transparent;
      }

      svg { width: 18px; height: 18px; }
    }

    .modal-header-bg {
      position: relative;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .modal-icon {
      font-size: 4.5rem;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
    }

    .modal-header-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 0%, #0F172A 100%);
    }

    .modal-stars-badge {
      position: absolute;
      bottom: 1rem;
      right: 1.5rem;
      z-index: 3;
      padding: 0.3rem 0.85rem;
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 700;
      color: #FBBF24;
    }

    .modal-body {
      padding: 1.75rem 2rem 2.25rem;
    }

    .modal-meta-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .modal-tag {
      padding: 0.2rem 0.65rem;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #60A5FA;
    }

    .modal-year {
      font-size: 0.82rem;
      color: #94A3B8;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }

    .modal-section {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94A3B8;
        margin-bottom: 0.5rem;
      }
    }

    .modal-description {
      font-size: 0.98rem;
      color: #CBD5E1;
      line-height: 1.7;
    }

    .tech-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-chip-lg {
      padding: 0.35rem 0.85rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 100px;
      font-size: 0.82rem;
      color: #E2E8F0;
      font-weight: 500;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.6rem;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;

      svg { width: 18px; height: 18px; }
    }

    .btn-live {
      background: #3B82F6;
      color: #fff;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);

      &:hover {
        background: #2563EB;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
      }
    }

    .btn-github {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #F8FAFC;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }
    }
  `]
})
export class ProjectDetailModalComponent {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  getGradient(): string {
    if (!this.project) return 'linear-gradient(135deg, #1a3a5c, #2d6a9f)';
    const gradients = [
      'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
      'linear-gradient(135deg, #0f2647 0%, #1a5276 100%)',
      'linear-gradient(135deg, #1b3a6b 0%, #2e86ab 100%)',
      'linear-gradient(135deg, #152744 0%, #4a90d9 100%)',
    ];
    return gradients[this.project.id % gradients.length];
  }

  getProjectIcon(): string {
    if (!this.project) return '⚡';
    const icons = ['⚡', '🚀', '🌐', '🔧', '💡', '🎯'];
    return icons[this.project.id % icons.length];
  }
}
