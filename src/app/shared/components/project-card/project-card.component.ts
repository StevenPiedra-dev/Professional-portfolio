import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="project-card" [class.featured]="project.featured" role="article" (click)="onCardClick()">
      <div class="card-image-wrapper">
        <div class="card-image-bg" [style.background]="getGradient()">
          <div class="card-image-icon">
            <span class="code-icon">{{ getProjectIcon() }}</span>
          </div>
        </div>
        <div class="card-stars-chip" *ngIf="project.stars">
          ⭐ {{ project.stars }}
        </div>
        <div class="card-overlay">
          <div class="card-links">
            <button type="button" class="card-link primary" (click)="onMoreInfo($event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Ver Proyecto
            </button>
            <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" rel="noopener"
               class="card-link" (click)="$event.stopPropagation()">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="card-header-row">
          <h3 class="card-title">{{ project.title }}</h3>
        </div>
        <p class="card-description">{{ project.description }}</p>
        <div class="card-tags" role="list" aria-label="Tecnologías utilizadas">
          <span *ngFor="let tech of project.technologies" class="tag" role="listitem">{{ tech }}</span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .project-card {
      position: relative;
      background: var(--surface-glass, #0F172A);
      border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: pointer;
    }
    .project-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }
    .card-image-wrapper {
      position: relative;
      height: 190px;
      overflow: hidden;
    }
    .card-image-bg {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .code-icon {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }
    .card-stars-chip {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      z-index: 2;
      padding: 0.25rem 0.7rem;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(251, 191, 36, 0.4);
      border-radius: 100px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #FBBF24;
      backdrop-filter: blur(4px);
    }
    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10, 25, 47, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .project-card:hover .card-overlay { opacity: 1; }
    .card-links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .card-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .card-link:hover { background: rgba(255,255,255,0.25); transform: scale(1.04); }
    .card-link.primary { background: #3B82F6; border-color: transparent; }
    .card-link.primary:hover { background: #2563EB; }
    .card-link svg { width: 15px; height: 15px; }
    .card-content { padding: 20px; }
    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0;
    }
    .card-description {
      font-size: 0.88rem;
      color: #94A3B8;
      line-height: 1.6;
      margin: 0 0 14px;
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tag {
      padding: 3px 10px;
      background: rgba(59, 130, 246, 0.1);
      color: #60A5FA;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Output() selectProject = new EventEmitter<Project>();

  onCardClick() {
    this.selectProject.emit(this.project);
  }

  onMoreInfo(event: MouseEvent) {
    event.stopPropagation();
    this.selectProject.emit(this.project);
  }

  getGradient(): string {
    const gradients = [
      'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
      'linear-gradient(135deg, #0f2647 0%, #1a5276 100%)',
      'linear-gradient(135deg, #1b3a6b 0%, #2e86ab 100%)',
      'linear-gradient(135deg, #152744 0%, #4a90d9 100%)',
    ];
    return gradients[this.project.id % gradients.length];
  }

  getProjectIcon(): string {
    const icons = ['⚡', '🚀', '🌐', '🔧', '💡', '🎯'];
    return icons[this.project.id % icons.length];
  }
}
