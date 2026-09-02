import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { BlogPost } from '../../core/models/portfolio.models';
import { BlogDetailModalComponent } from '../../shared/components/blog-detail-modal/blog-detail-modal.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BlogDetailModalComponent],
  template: `
    <main class="blog-page">

      <!-- ── Hero ── -->
      <section class="blog-hero">
        <div class="hero-grid-bg"></div>
        <div class="hero-content">
          <span class="badge">Artículos y Noticias</span>
          <h1>My <span class="gradient-text">Blog</span></h1>
          <p class="hero-subtitle">
            Reflexiones sobre desarrollo Full Stack, tendencias en IA, diseño de productos y lecciones aprendidas en el mundo real.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">{{ posts().length }}</span>
              <span class="stat-lbl">Artículos</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat-item">
              <span class="stat-num">5</span>
              <span class="stat-lbl">Categorías</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat-item">
              <span class="stat-num">2.4K</span>
              <span class="stat-lbl">Lecturas</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Featured Post ── -->
      <section class="featured-section" *ngIf="featuredPost()">
        <div class="section-container">
          <div class="featured-article">
            <div class="featured-visual" [style.background]="featuredPost()!.gradient">
              <img *ngIf="featuredPost()!.coverImage" [src]="featuredPost()!.coverImage" [alt]="featuredPost()!.title" class="featured-cover-img" />
              <span *ngIf="!featuredPost()!.coverImage" class="featured-icon">{{ featuredPost()!.icon || '📝' }}</span>
              <div class="featured-visual-overlay"></div>
              <div class="featured-visual-badge">
                <span>⭐ Artículo destacado</span>
              </div>
            </div>
            <div class="featured-content">
              <div class="featured-meta">
                <span class="category-badge" [class]="'cat-' + featuredPost()!.category">
                  {{ getCategoryIcon(featuredPost()!.category) }} {{ getCategoryLabel(featuredPost()!.category) }}
                </span>
                <span class="meta-date">{{ featuredPost()!.date }}</span>
              </div>
              <h2 class="featured-title">{{ featuredPost()!.title }}</h2>
              <p class="featured-excerpt">{{ featuredPost()!.excerpt }}</p>
              <div class="featured-footer">
                <div class="post-stats">
                  <span class="post-stat">⏱️ {{ featuredPost()!.readTime }} min lectura</span>
                  <button class="card-like-btn" [class.liked]="isLiked(featuredPost()!.id)" (click)="onLikePost($event, featuredPost()!)" [title]="isLiked(featuredPost()!.id) ? 'Quitar like' : 'Dar me gusta'">
                    {{ isLiked(featuredPost()!.id) ? '❤️' : '🤍' }} {{ getLikes(featuredPost()!) }}
                  </button>
                </div>
                <button class="read-btn" (click)="onReadPost(featuredPost()!)">
                  Leer artículo →
                </button>
              </div>
              <div class="featured-tags">
                <span *ngFor="let tag of featuredPost()!.tags" class="post-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Controls ── -->
      <section class="controls-section">
        <div class="section-container">
          <div class="controls-bar">
            <!-- Search -->
            <div class="search-wrapper">
              <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                class="search-input"
                placeholder="Buscar artículos..."
                [(ngModel)]="searchQ"
                id="blog-search"
              />
            </div>

            <!-- Categories -->
            <div class="cat-tabs">
              <button
                *ngFor="let cat of categories"
                class="cat-tab"
                [class.active]="activeCat() === cat.id"
                (click)="activeCat.set(cat.id)"
              >
                <span>{{ cat.icon }}</span> {{ cat.label }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Posts Grid ── -->
      <section class="posts-section">
        <div class="section-container">
          <div class="posts-header">
            <h2 class="posts-title">
              <span *ngIf="activeCat() !== 'all'">{{ getCategoryIcon(activeCat()) }} {{ getCategoryLabel(activeCat()) }}</span>
              <span *ngIf="activeCat() === 'all' && !searchQ">Todos los artículos</span>
              <span *ngIf="searchQ">Resultados para "<em>{{ searchQ }}</em>"</span>
            </h2>
            <span class="posts-count">{{ filteredPosts().length }} artículo{{ filteredPosts().length !== 1 ? 's' : '' }}</span>
          </div>

          <!-- No results -->
          <div class="no-results" *ngIf="filteredPosts().length === 0">
            <div class="no-results-ico">📭</div>
            <h3>No se encontraron artículos</h3>
            <p>Intenta con otro término de búsqueda o categoría.</p>
            <button class="btn-clear" (click)="clearSearch()">Limpiar filtros</button>
          </div>

          <!-- Grid -->
          <div class="posts-grid" *ngIf="filteredPosts().length > 0">
            <article
              *ngFor="let post of filteredPosts(); trackBy: trackPost"
              class="post-card"
              [class.featured-card]="post.featured"
              (click)="onReadPost(post)"
              [attr.aria-label]="'Leer: ' + post.title"
              tabindex="0"
              role="button"
              (keydown.enter)="onReadPost(post)"
            >
              <div class="post-visual" [style.background]="post.gradient">
                <img *ngIf="post.coverImage" [src]="post.coverImage" [alt]="post.title" class="post-cover-img" />
                <span *ngIf="!post.coverImage" class="post-icon">{{ post.icon || '📝' }}</span>
                <div class="post-visual-overlay"></div>
              </div>
              <div class="post-body">
                <div class="post-meta">
                  <span class="post-category" [class]="'cat-' + post.category">
                    {{ getCategoryIcon(post.category) }} {{ getCategoryLabel(post.category) }}
                  </span>
                  <span class="post-date">{{ post.date }}</span>
                </div>
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <div class="post-footer">
                  <div class="post-info-row">
                    <span class="read-time">⏱️ {{ post.readTime }} min</span>
                    <div class="post-engagements">
                      <button class="card-like-btn" [class.liked]="isLiked(post.id)" (click)="onLikePost($event, post)" [title]="isLiked(post.id) ? 'Quitar like' : 'Dar me gusta'">
                        {{ isLiked(post.id) ? '❤️' : '🤍' }} {{ getLikes(post) }}
                      </button>
                    </div>
                  </div>
                  <div class="post-tags">
                    <span *ngFor="let tag of post.tags.slice(0, 3)" class="post-tag-sm">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ── Newsletter CTA ── -->
      <section class="newsletter-section">
        <div class="section-container">
          <div class="newsletter-card">
            <div class="newsletter-icon">✉️</div>
            <div class="newsletter-text">
              <h2>¿Te gustan estos artículos?</h2>
              <p>Sígueme en LinkedIn para estar al tanto de los últimos contenidos sobre desarrollo, IA y producto.</p>
            </div>
            <div class="newsletter-actions">
              <a href="https://www.linkedin.com/in/stevenpiedra/" target="_blank" rel="noopener" class="newsletter-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Seguir en LinkedIn
              </a>
              <a href="https://github.com/StevenPiedra-dev" target="_blank" rel="noopener" class="newsletter-btn outline">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- BLOG DETAIL MODAL -->
      <app-blog-detail-modal
        [post]="selectedPost()"
        (close)="selectedPost.set(null)"
      ></app-blog-detail-modal>

    </main>
  `,
  styles: [`
    /* ── Layout ── */
    .blog-page {
      min-height: 100vh;
      padding-top: var(--nav-height);
    }

    .section-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* ── Hero ── */
    .blog-hero {
      position: relative;
      padding: 5rem 1.5rem 4rem;
      text-align: center;
      overflow: hidden;
    }

    .hero-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 650px;
      margin: 0 auto;
    }

    .badge {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--blue-400);
      background: rgba(59,130,246,0.12);
      border: 1px solid rgba(59,130,246,0.25);
      padding: 0.3rem 1rem;
      border-radius: 100px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .blog-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 1rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #C084FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
      margin-bottom: 2rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-num {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--blue-400);
      line-height: 1;
    }

    .stat-lbl {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 2px;
    }

    .stat-div {
      width: 1px;
      height: 36px;
      background: var(--border-subtle);
    }

    /* ── Featured ── */
    .featured-section {
      padding: 0 1.5rem 3rem;
    }

    .featured-article {
      display: grid;
      grid-template-columns: 1fr;
      background: rgba(15,23,42,0.7);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(12px);
      transition: border-color 0.3s, box-shadow 0.3s;

      &:hover {
        border-color: var(--border-medium);
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      }

      @media (min-width: 768px) {
        grid-template-columns: 380px 1fr;
      }
    }

    .featured-visual {
      position: relative;
      min-height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (min-width: 768px) { min-height: 340px; }
    }

    .featured-icon { font-size: 5rem; position: relative; z-index: 1; }

    .featured-visual-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, transparent 0%, rgba(15,23,42,0.6) 100%);
      z-index: 2;
    }

    .featured-cover-img, .post-cover-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .card-like-btn {
      background: rgba(239, 68, 68, 0.12);
      color: #F87171;
      border: 1px solid rgba(239, 68, 68, 0.25);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.25);
        transform: scale(1.05);
      }

      &.liked {
        background: rgba(239, 68, 68, 0.3);
        border-color: #EF4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
      }
    }

    .featured-visual-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 2;

      span {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(251,191,36,0.15);
        border: 1px solid rgba(251,191,36,0.3);
        border-radius: 100px;
        font-size: 0.72rem;
        font-weight: 700;
        color: #FBBF24;
      }
    }

    .featured-content { padding: 2rem; display: flex; flex-direction: column; }

    .featured-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .meta-date {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.7rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Category Colors */
    .cat-frontend { color: #60A5FA; background: rgba(96,165,250,0.12); border: 1px solid rgba(96,165,250,0.2); }
    .cat-backend { color: #34D399; background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.2); }
    .cat-ai { color: #C084FC; background: rgba(192,132,252,0.12); border: 1px solid rgba(192,132,252,0.2); }
    .cat-devops { color: #FBBF24; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.2); }
    .cat-product { color: #F472B6; background: rgba(244,114,182,0.12); border: 1px solid rgba(244,114,182,0.2); }

    .featured-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }

    .featured-excerpt {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      flex: 1;
    }

    .featured-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .post-stats {
      display: flex;
      gap: 1rem;
    }

    .post-stat {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .read-btn {
      padding: 0.6rem 1.5rem;
      background: var(--blue-500);
      color: #fff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      &:hover {
        background: var(--blue-600);
        transform: translateX(4px);
      }
    }

    .featured-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .post-tag {
      padding: 0.2rem 0.65rem;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      border-radius: 100px;
      font-size: 0.72rem;
      color: var(--blue-300);
      font-weight: 500;
    }

    /* ── Controls ── */
    .controls-section {
      padding: 0 0 2rem;
    }

    .controls-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: rgba(15,23,42,0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
    }

    .search-wrapper {
      position: relative;
      flex: 1;
    }

    .search-ico {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.9rem;
      transition: border-color 0.2s;

      &:focus { outline: none; border-color: var(--blue-500); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
      &::placeholder { color: var(--text-muted); }
    }

    .cat-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .cat-tab {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(59,130,246,0.1);
        color: var(--text-primary);
      }

      &.active {
        background: rgba(59,130,246,0.18);
        border-color: rgba(59,130,246,0.35);
        color: var(--blue-400);
      }
    }

    /* ── Posts ── */
    .posts-section {
      padding: 0 0 5rem;
    }

    .posts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .posts-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #F8FAFC;
      em { color: var(--blue-400); font-style: normal; }
    }

    .posts-count {
      font-size: 0.85rem;
      color: var(--text-muted);
      background: rgba(255,255,255,0.05);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
    }

    /* No results */
    .no-results {
      text-align: center;
      padding: 4rem 1rem;
      .no-results-ico { font-size: 3rem; margin-bottom: 1rem; }
      h3 { color: #F8FAFC; margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    }

    .btn-clear {
      padding: 0.6rem 1.5rem;
      background: var(--blue-500);
      color: #fff;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      &:hover { background: var(--blue-600); }
    }

    /* Grid */
    .posts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .post-card {
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        border-color: var(--border-medium);
      }

      &:hover .post-visual-overlay {
        background: rgba(10,25,47,0.5);
      }

      &.featured-card {
        border-color: rgba(251,191,36,0.2);
      }
    }

    .post-visual {
      position: relative;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .post-icon { font-size: 3rem; position: relative; z-index: 1; }

    .post-visual-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10,25,47,0.15);
      transition: background 0.3s;
    }

    .post-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }

    .post-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .post-category {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.65rem;
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .post-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .post-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-excerpt {
      font-size: 0.83rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-footer { margin-top: auto; }

    .post-info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .read-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .post-engagements {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .post-tag-sm {
      padding: 0.15rem 0.55rem;
      background: rgba(59,130,246,0.08);
      border: 1px solid rgba(59,130,246,0.15);
      border-radius: 100px;
      font-size: 0.68rem;
      color: var(--blue-300);
      font-weight: 500;
    }

    /* ── Newsletter ── */
    .newsletter-section {
      padding: 0 1.5rem 5rem;
    }

    .newsletter-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.5rem;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(192,132,252,0.06) 100%);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;

      @media (min-width: 768px) {
        flex-direction: row;
        text-align: left;
        justify-content: space-between;
        align-items: center;
      }
    }

    .newsletter-icon { font-size: 2.5rem; flex-shrink: 0; }

    .newsletter-text {
      flex: 1;

      h2 {
        font-size: 1.5rem;
        font-weight: 800;
        color: #F8FAFC;
        margin-bottom: 0.5rem;
      }
      p { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    }

    .newsletter-actions {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: center;
    }

    .newsletter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.5rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      background: var(--blue-500);
      color: #fff;
      transition: all 0.25s;

      &:hover {
        background: var(--blue-600);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59,130,246,0.3);
      }

      &.outline {
        background: transparent;
        color: var(--text-primary);
        border: 1px solid var(--border-medium);

        &:hover {
          background: rgba(59,130,246,0.1);
          border-color: var(--blue-500);
        }
      }
    }
  `]
})
export class BlogComponent {
  private portfolioService = inject(PortfolioService);

  posts = this.portfolioService.blogPostsSignal;
  selectedPost = signal<BlogPost | null>(null);

  searchQ = '';
  activeCat = signal<string>('all');

  categories = [
    { id: 'all', label: 'Todos', icon: '🗂️' },
    { id: 'ai', label: 'IA & ML', icon: '🤖' },
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'devops', label: 'DevOps', icon: '☁️' },
    { id: 'product', label: 'Producto', icon: '🎯' }
  ];

  featuredPost = computed(() => this.posts().find(p => p.featured));

  filteredPosts = computed(() => {
    let list = this.posts().filter(p => !p.featured);

    if (this.activeCat() !== 'all') {
      list = list.filter(p => p.category === this.activeCat());
    }

    if (this.searchQ.trim()) {
      const q = this.searchQ.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  });

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      ai: '🤖', frontend: '🎨', backend: '⚙️', devops: '☁️', product: '🎯'
    };
    return icons[cat] || '📝';
  }

  getCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      ai: 'IA & ML', frontend: 'Frontend', backend: 'Backend', devops: 'DevOps', product: 'Producto'
    };
    return labels[cat] || cat;
  }

  isLiked(id: number): boolean {
    return this.portfolioService.isBlogLiked(id);
  }

  getLikes(post: BlogPost): number {
    const live = this.posts().find(p => p.id === post.id);
    return live ? live.likes : post.likes;
  }

  onLikePost(event: MouseEvent, post: BlogPost) {
    event.stopPropagation();
    this.portfolioService.toggleBlogLike(post.id);
  }

  clearSearch() {
    this.searchQ = '';
    this.activeCat.set('all');
  }

  onReadPost(post: BlogPost) {
    this.selectedPost.set(post);
  }

  trackPost(index: number, post: BlogPost): number {
    return post.id;
  }
}
