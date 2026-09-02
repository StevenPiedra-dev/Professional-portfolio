import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/portfolio.models';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';

@Component({
  selector: 'app-project-detail-modal',
  standalone: true,
  imports: [CommonModule, ImageCarouselComponent],
  template: `
    <div class="modal-overlay" (click)="closeModal()" *ngIf="project">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <span class="category-badge">{{ project.category | uppercase }}</span>
            <h2 class="modal-title">{{ project.title }}</h2>
          </div>
          <button class="close-btn" (click)="closeModal()" aria-label="Close modal">✕</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- 3-Photo Image Carousel -->
          <div class="carousel-wrapper">
            <app-image-carousel 
              [images]="project.images || [project.imageUrl]" 
              [fallbackImage]="project.imageUrl">
            </app-image-carousel>
          </div>

          <!-- Interactive Stars Counter Chip -->
          <div class="meta-chips-row">
            <button class="star-chip-btn" [class.starred]="isStarred()" (click)="onStarClick($event)" [title]="isStarred() ? 'Quitar calificación' : 'Calificar proyecto'">
              {{ isStarred() ? '⭐' : '☆' }} {{ getStars() }} {{ isStarred() ? 'Calificado' : 'Dar Estrella' }}
            </button>
            <span class="year-chip" *ngIf="project.year">{{ project.year }}</span>
          </div>

          <!-- Overview & Description -->
          <div class="description-section">
            <h4 class="section-subtitle">Descripción del Proyecto</h4>
            <p class="long-desc">{{ project.longDescription || project.description }}</p>
          </div>

          <!-- Technologies -->
          <div class="tech-section">
            <h4 class="section-subtitle">Tecnologías Utilizadas</h4>
            <div class="tech-tags">
              <span *ngFor="let tech of project.technologies" class="tech-tag">{{ tech }}</span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <a 
            *ngIf="project.githubUrl" 
            [href]="project.githubUrl" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="action-btn github-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Ver Código en GitHub
          </a>
          <button class="action-btn close-footer-btn" (click)="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(6, 11, 24, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.25s ease-out;
    }

    .modal-card {
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 20px;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.2);
      display: flex;
      flex-direction: column;
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      padding: 24px 28px 16px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid rgba(59, 130, 246, 0.15);
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(59, 130, 246, 0.15);
      color: #60A5FA;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .modal-title {
      font-size: 22px;
      font-weight: 800;
      color: #F8FAFC;
      line-height: 1.3;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94A3B8;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
      border-color: rgba(239, 68, 68, 0.4);
    }

    .modal-body {
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .meta-chips-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .star-chip-btn {
      background: rgba(234, 179, 8, 0.1);
      color: #94A3B8;
      border: 1px solid rgba(234, 179, 8, 0.25);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .star-chip-btn:hover {
      background: rgba(234, 179, 8, 0.2);
      transform: scale(1.05);
      color: #FACC15;
    }

    .star-chip-btn.starred {
      background: rgba(234, 179, 8, 0.2);
      color: #FACC15;
      border-color: rgba(234, 179, 8, 0.5);
      box-shadow: 0 0 10px rgba(234, 179, 8, 0.2);
    }

    .year-chip {
      background: rgba(148, 163, 184, 0.1);
      color: #94A3B8;
      border: 1px solid rgba(148, 163, 184, 0.2);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .section-subtitle {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #38BDF8;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .long-desc {
      color: #CBD5E1;
      font-size: 14px;
      line-height: 1.7;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-tag {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.25);
      color: #93C5FD;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .modal-footer {
      padding: 20px 28px 24px;
      border-top: 1px solid rgba(59, 130, 246, 0.15);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .action-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .github-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .github-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
    }

    .close-footer-btn {
      background: rgba(148, 163, 184, 0.15);
      color: #CBD5E1;
      border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .close-footer-btn:hover {
      background: rgba(148, 163, 184, 0.25);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleUp {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ProjectDetailModalComponent {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  private portfolioService = inject(PortfolioService);

  closeModal(): void {
    this.close.emit();
  }

  isStarred(): boolean {
    return !!this.project && this.portfolioService.isProjectStarred(this.project.id);
  }

  getStars(): number {
    if (!this.project) return 0;
    const live = this.portfolioService.projectsSignal().find(p => p.id === this.project!.id);
    return live ? (live.stars || 0) : (this.project.stars || 0);
  }

  onStarClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.project) {
      this.portfolioService.toggleProjectStar(this.project.id);
    }
  }
}
