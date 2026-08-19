import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../../../core/models/portfolio.models';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-blog-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()" role="dialog" aria-modal="true" *ngIf="post">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Close button -->
        <button class="close-btn" (click)="closeModal()" aria-label="Cerrar artículo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Header -->
        <div class="modal-header-bg" [style.background]="post.gradient">
          <span class="modal-icon">{{ post.icon }}</span>
          <div class="modal-header-overlay"></div>
          <div class="likes-badge" (click)="onLike()" title="Dar me gusta">
            ❤️ {{ post.likes }} Likes
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="modal-meta">
            <span class="cat-badge" [class]="'cat-' + post.category">{{ getCategoryLabel(post.category) }}</span>
            <span class="meta-item">🗓️ {{ post.date }}</span>
            <span class="meta-item">⏱️ {{ post.readTime }} min de lectura</span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>
          <p class="post-excerpt">{{ post.excerpt }}</p>

          <hr class="divider" />

          <!-- Main Article Content -->
          <div class="post-content">
            <p *ngFor="let paragraph of getParagraphs()" class="content-paragraph">
              {{ paragraph }}
            </p>
          </div>

          <!-- Tags & Like CTA -->
          <div class="post-footer">
            <div class="tags-wrapper">
              <span *ngFor="let tag of post.tags" class="tag-chip">#{{ tag }}</span>
            </div>

            <button class="like-btn" [class.liked]="hasLiked" (click)="onLike()">
              ❤️ {{ hasLiked ? '¡Gracias!' : 'Me gusta (' + post.likes + ')' }}
            </button>
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
      max-width: 760px;
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
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .modal-icon {
      font-size: 5rem;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
    }

    .modal-header-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 0%, #0F172A 100%);
    }

    .likes-badge {
      position: absolute;
      bottom: 1rem;
      right: 1.5rem;
      z-index: 3;
      padding: 0.35rem 0.95rem;
      background: rgba(244, 114, 182, 0.15);
      border: 1px solid rgba(244, 114, 182, 0.35);
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #F472B6;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.05);
        background: rgba(244, 114, 182, 0.3);
      }
    }

    .modal-body {
      padding: 1.75rem 2.25rem 2.5rem;
    }

    .modal-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .cat-badge {
      padding: 0.2rem 0.75rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .cat-frontend { color: #60A5FA; background: rgba(96,165,250,0.12); border: 1px solid rgba(96,165,250,0.2); }
    .cat-backend { color: #34D399; background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.2); }
    .cat-ai { color: #C084FC; background: rgba(192,132,252,0.12); border: 1px solid rgba(192,132,252,0.2); }
    .cat-devops { color: #FBBF24; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.2); }
    .cat-product { color: #F472B6; background: rgba(244,114,182,0.12); border: 1px solid rgba(244,114,182,0.2); }

    .meta-item {
      font-size: 0.82rem;
      color: #94A3B8;
    }

    .post-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 0.85rem;
      line-height: 1.3;
    }

    .post-excerpt {
      font-size: 1.05rem;
      color: #94A3B8;
      line-height: 1.6;
      font-style: italic;
      margin-bottom: 1.5rem;
    }

    .divider {
      border: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin-bottom: 1.75rem;
    }

    .post-content {
      font-size: 1rem;
      color: #E2E8F0;
      line-height: 1.8;
      margin-bottom: 2rem;
    }

    .content-paragraph {
      margin-bottom: 1.25rem;
      white-space: pre-line;
    }

    .post-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .tag-chip {
      padding: 0.2rem 0.65rem;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 100px;
      font-size: 0.75rem;
      color: #60A5FA;
    }

    .like-btn {
      padding: 0.6rem 1.4rem;
      background: rgba(244, 114, 182, 0.15);
      border: 1px solid rgba(244, 114, 182, 0.35);
      color: #F472B6;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #EC4899;
        color: #fff;
        transform: scale(1.05);
      }

      &.liked {
        background: #EC4899;
        color: #fff;
      }
    }
  `]
})
export class BlogDetailModalComponent {
  @Input() post: BlogPost | null = null;
  @Output() close = new EventEmitter<void>();

  private portfolioService = inject(PortfolioService);
  hasLiked = false;

  closeModal() {
    this.close.emit();
  }

  onLike() {
    if (this.post && !this.hasLiked) {
      this.portfolioService.likeBlogPost(this.post.id);
      this.hasLiked = true;
    }
  }

  getCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      ai: 'IA & ML', frontend: 'Frontend', backend: 'Backend', devops: 'DevOps', product: 'Producto'
    };
    return labels[cat] || cat;
  }

  getParagraphs(): string[] {
    if (!this.post) return [];
    const text = this.post.content || this.post.excerpt;
    return text.split('\n\n').filter(p => p.trim().length > 0);
  }
}
