import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project } from '../../core/models/portfolio.models';
import { ProjectDetailModalComponent } from '../../shared/components/project-detail-modal/project-detail-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProjectDetailModalComponent],
  template: `
    <main class="projects-page">

      <!-- ── Hero Header ── -->
      <section class="projects-hero">
        <div class="hero-bg-grid"></div>
        <div class="hero-content">
          <span class="badge">Portfolio</span>
          <h1>All my <span class="gradient-text">Projects</span></h1>
          <p class="hero-subtitle">
            Explore web development, Artificial Intelligence, and product management solutions built with cutting-edge technologies.
          </p>
          <div class="hero-stats">
            <div class="stat-pill">
              <span class="stat-number">{{ allProjects().length }}+</span>
              <span class="stat-label">Projects</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-pill">
              <span class="stat-number">8+</span>
              <span class="stat-label">Technologies</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-pill">
              <span class="stat-number">3+</span>
              <span class="stat-label">Years</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Controls Bar ── -->
      <section class="controls-section">
        <div class="controls-inner">
          <!-- Search -->
          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              class="search-input"
              placeholder="Search projects..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              id="project-search"
            />
          </div>

          <!-- Filter Tabs -->
          <div class="filter-tabs" role="tablist" aria-label="Filter by category">
            <button
              *ngFor="let cat of categories"
              class="filter-tab"
              [class.active]="activeCategory() === cat.id"
              (click)="setCategory(cat.id)"
              role="tab"
              [attr.aria-selected]="activeCategory() === cat.id"
            >
              <span class="tab-icon">{{ cat.icon }}</span>
              {{ cat.label }}
            </button>
          </div>

          <!-- Sort -->
          <div class="sort-wrapper">
            <select class="sort-select" [(ngModel)]="sortBy" (ngModelChange)="onSort()" id="project-sort">
              <option value="featured">Featured first</option>
              <option value="stars">Most stars</option>
              <option value="recent">Most recent</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      <!-- ── Featured Banner ── -->
      <section class="featured-banner" *ngIf="activeCategory() === 'all' && !searchQuery">
        <div class="banner-inner">
          <h2 class="banner-title">
            <span class="banner-icon">⭐</span>
            Featured Projects
          </h2>
          <div class="featured-grid">
            <article
              *ngFor="let project of featuredProjects()"
              class="featured-card"
              [class.featured-large]="project.id === 1"
              (click)="onOpenDetail(project)"
            >
              <div class="featured-card-bg" [style.background]="getGradient(project.id)">
                <span class="featured-card-icon">{{ getIcon(project.id) }}</span>
              </div>
              <div class="featured-card-overlay">
                <div class="featured-card-links">
                  <button type="button" class="btn-link primary" (click)="onOpenDetail(project); $event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live Demo
                  </button>
                  <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" rel="noopener" class="btn-link secondary" (click)="$event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    Code
                  </a>
                </div>
              </div>
              <div class="featured-card-content">
                <div class="featured-card-meta">
                  <span class="featured-badge">⭐ Featured</span>
                  <div class="featured-stats">
                    <span class="stat-chip">⭐ {{ project.stars || 10 }}</span>
                  </div>
                </div>
                <h3 class="featured-card-title">{{ project.title }}</h3>
                <p class="featured-card-desc">{{ project.description }}</p>
                <div class="tech-chips">
                  <span *ngFor="let tech of project.technologies.slice(0, 4)" class="tech-chip">{{ tech }}</span>
                  <span *ngIf="project.technologies.length > 4" class="tech-chip more">+{{ project.technologies.length - 4 }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ── All Projects Grid ── -->
      <section class="all-projects-section">
        <div class="section-inner">
          <div class="section-header" *ngIf="activeCategory() !== 'all' || searchQuery">
            <h2 class="section-title">
              <span *ngIf="searchQuery">Results for "<em>{{ searchQuery }}</em>"</span>
              <span *ngIf="!searchQuery">{{ getCategoryLabel(activeCategory()) }}</span>
            </h2>
            <span class="results-count">{{ filteredProjects().length }} project{{ filteredProjects().length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="section-header" *ngIf="activeCategory() === 'all' && !searchQuery">
            <h2 class="section-title">All projects</h2>
            <span class="results-count">{{ filteredProjects().length }} total</span>
          </div>

          <!-- No results -->
          <div class="no-results" *ngIf="filteredProjects().length === 0">
            <div class="no-results-icon">🔍</div>
            <h3>No projects found</h3>
            <p>Try another search term or category.</p>
            <button class="btn-clear" (click)="clearFilters()">Clear filters</button>
          </div>

          <!-- Grid -->
          <div class="projects-grid" *ngIf="filteredProjects().length > 0">
            <article
              *ngFor="let project of filteredProjects(); trackBy: trackProject"
              class="project-card"
              [class.is-featured]="project.featured"
              (click)="onOpenDetail(project)"
            >
              <div class="card-visual" [style.background]="getGradient(project.id)">
                <span class="card-visual-icon">{{ getIcon(project.id) }}</span>
                <div class="card-hover-overlay">
                  <div class="card-actions">
                    <button type="button" class="action-btn" (click)="onOpenDetail(project); $event.stopPropagation()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 01-2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Demo
                    </button>
                    <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" rel="noopener" class="action-btn ghost" (click)="$event.stopPropagation()">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </a>
                  </div>
                </div>
                <div class="featured-ribbon" *ngIf="project.featured">⭐ Featured</div>
              </div>
              <div class="card-body">
                <div class="card-meta-row">
                  <div class="card-stars" *ngIf="project.stars">
                    <span>⭐ {{ project.stars }}</span>
                  </div>
                </div>
                <h3 class="card-title">{{ project.title }}</h3>
                <p class="card-desc">{{ project.description }}</p>
                <div class="card-techs">
                  <span *ngFor="let tech of project.technologies.slice(0, 3)" class="tech-tag">{{ tech }}</span>
                  <span *ngIf="project.technologies.length > 3" class="tech-tag extra">+{{ project.technologies.length - 3 }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ── CTA Banner ── -->
      <section class="cta-section">
        <div class="cta-inner">
          <div class="cta-icon">🚀</div>
          <h2>Have a project in mind?</h2>
          <p>I am available for collaborations, freelance, and job opportunities.</p>
          <div class="cta-actions">
            <a href="https://github.com/StevenPiedra-dev" target="_blank" rel="noopener" class="cta-btn primary">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              View GitHub
            </a>
            <a href="mailto:steven.piedra02@gmail.com" class="cta-btn secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Contact Me
            </a>
          </div>
        </div>
      </section>

      <!-- PROJECT DETAIL MODAL -->
      <app-project-detail-modal
        [project]="selectedProject()"
        (close)="selectedProject.set(null)"
      ></app-project-detail-modal>

    </main>
  `,
  styles: [`
    /* ── Page Layout ── */
    .projects-page {
      min-height: 100vh;
      padding-top: var(--nav-height);
    }

    /* ── Hero ── */
    .projects-hero {
      position: relative;
      padding: 5rem 1.5rem 4rem;
      text-align: center;
      overflow: hidden;
    }

    .hero-bg-grid {
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
      max-width: 700px;
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

    .projects-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: #F8FAFC;
      line-height: 1.1;
      margin-bottom: 1.25rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 560px;
      margin: 0 auto 2rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--blue-400);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 2px;
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--border-subtle);
    }

    /* ── Controls ── */
    .controls-section {
      padding: 0 1.5rem 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }

    .controls-inner {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: rgba(15,23,42,0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
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

    .search-icon {
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
      padding: 0.65rem 1rem 0.65rem 2.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.9rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: var(--blue-500);
        box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
      }

      &::placeholder { color: var(--text-muted); }
    }

    .filter-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.9rem;
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

    .tab-icon { font-size: 0.85em; }

    .sort-select {
      padding: 0.55rem 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.85rem;
      cursor: pointer;
      min-width: 180px;

      &:focus { outline: none; border-color: var(--blue-500); }

      option { background: #0F172A; }
    }

    /* ── Featured Banner ── */
    .featured-banner {
      padding: 0 1.5rem 3rem;
      max-width: 1280px;
      margin: 0 auto;
    }

    .banner-inner {}

    .banner-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .banner-icon { font-size: 1.1em; }

    .featured-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .featured-card {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      background: var(--surface-card);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      cursor: pointer;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        border-color: var(--border-medium);
      }

      &:hover .featured-card-overlay { opacity: 1; }
    }

    .featured-card-bg {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .featured-card-icon { font-size: 3.5rem; }

    .featured-card-overlay {
      position: absolute;
      inset: 0;
      height: 180px;
      background: rgba(10,25,47,0.88);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      backdrop-filter: blur(4px);
    }

    .featured-card-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;

      svg { width: 14px; height: 14px; }

      &.primary {
        background: var(--blue-500);
        color: #fff;
        &:hover { background: var(--blue-600); }
      }
      &.secondary {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.4);
        &:hover { background: rgba(255,255,255,0.1); }
      }
    }

    .featured-card-content { padding: 1.25rem; flex: 1; }

    .featured-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .featured-badge {
      font-size: 0.7rem;
      font-weight: 600;
      color: #FBBF24;
      background: rgba(251,191,36,0.12);
      border: 1px solid rgba(251,191,36,0.25);
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
    }

    .featured-stats {
      display: flex;
      gap: 0.6rem;
    }

    .stat-chip {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .featured-card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .featured-card-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tech-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .tech-chip {
      padding: 0.2rem 0.65rem;
      background: rgba(59,130,246,0.12);
      border: 1px solid rgba(59,130,246,0.22);
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 500;
      color: var(--blue-300);

      &.more {
        color: var(--text-muted);
        background: rgba(255,255,255,0.05);
        border-color: var(--border-subtle);
      }
    }

    /* ── All Projects ── */
    .all-projects-section {
      padding: 0 1.5rem 5rem;
      max-width: 1280px;
      margin: 0 auto;
    }

    .section-inner {}

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #F8FAFC;

      em { color: var(--blue-400); font-style: normal; }
    }

    .results-count {
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
      color: var(--text-secondary);

      .no-results-icon { font-size: 3rem; margin-bottom: 1rem; }
      h3 { color: #F8FAFC; margin-bottom: 0.5rem; }
      p { margin-bottom: 1.5rem; }
    }

    .btn-clear {
      padding: 0.6rem 1.5rem;
      background: var(--blue-500);
      color: #fff;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      &:hover { background: var(--blue-600); }
    }

    /* Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .project-card {
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        border-color: var(--border-medium);
      }

      &:hover .card-hover-overlay { opacity: 1; }

      &.is-featured {
        border-color: rgba(251,191,36,0.2);
      }
    }

    .card-visual {
      position: relative;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-visual-icon { font-size: 3.5rem; }

    .card-hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10,25,47,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      backdrop-filter: blur(4px);
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      background: var(--blue-500);
      color: #fff;
      transition: all 0.2s;
      svg { width: 14px; height: 14px; }

      &:hover { background: var(--blue-600); }

      &.ghost {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.35);
        &:hover { background: rgba(255,255,255,0.1); }
      }
    }

    .featured-ribbon {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 0.68rem;
      font-weight: 700;
      color: #FBBF24;
      background: rgba(251,191,36,0.15);
      border: 1px solid rgba(251,191,36,0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
    }

    .card-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }

    .card-meta-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.5rem;
    }

    .card-stars {
      display: flex;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-techs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: auto;
    }

    .tech-tag {
      padding: 0.2rem 0.65rem;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 500;
      color: var(--blue-300);

      &.extra {
        color: var(--text-muted);
        background: rgba(255,255,255,0.04);
        border-color: var(--border-subtle);
      }
    }

    /* ── CTA ── */
    .cta-section {
      padding: 5rem 1.5rem;
      background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(167,139,250,0.06) 100%);
      border-top: 1px solid var(--border-subtle);
    }

    .cta-inner {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }

    .cta-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .cta-section h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 0.75rem;
    }

    .cta-section p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.75rem;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s;

      &.primary {
        background: var(--blue-500);
        color: #fff;
        &:hover {
          background: var(--blue-600);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.3);
        }
      }
      &.secondary {
        background: transparent;
        color: var(--text-primary);
        border: 1px solid var(--border-medium);
        &:hover {
          background: rgba(59,130,246,0.1);
          border-color: var(--blue-500);
          transform: translateY(-2px);
        }
      }
    }
  `]
})
export class ProjectsComponent {
  private portfolioService = inject(PortfolioService);

  selectedProject = signal<Project | null>(null);
  allProjects = this.portfolioService.projectsSignal;

  searchQuery = '';
  sortBy = 'featured';

  activeCategory = signal<string>('all');

  categories = [
    { id: 'all', label: 'All', icon: '🗂️' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'ai', label: 'Artificial Intelligence', icon: '🤖' },
    { id: 'devops', label: 'Cloud & DevOps', icon: '☁️' }
  ];

  featuredProjects = computed(() =>
    this.allProjects().filter(p => p.featured)
  );

  filteredProjects = computed(() => {
    let projects = [...this.allProjects()];

    // Category filter
    if (this.activeCategory() !== 'all') {
      projects = projects.filter(p => p.category === this.activeCategory());
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'stars': projects.sort((a, b) => (b.stars || 0) - (a.stars || 0)); break;
      case 'name': projects.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'recent': projects.sort((a, b) => (b.year || 2026) - (a.year || 2026)); break;
      default: projects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }

    return projects;
  });

  onOpenDetail(project: Project) {
    this.selectedProject.set(project);
  }

  setCategory(id: string) {
    this.activeCategory.set(id);
  }

  onSearch() {}
  onSort() {}

  clearFilters() {
    this.searchQuery = '';
    this.activeCategory.set('all');
    this.sortBy = 'featured';
  }

  getCategoryLabel(id: string): string {
    return this.categories.find(c => c.id === id)?.label ?? 'Projects';
  }

  trackProject(index: number, project: Project): number {
    return project.id;
  }

  getGradient(id: number): string {
    const gradients = [
      'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
      'linear-gradient(135deg, #1a3a40 0%, #1a7a6e 100%)',
      'linear-gradient(135deg, #2a1a5c 0%, #6d3aab 100%)',
      'linear-gradient(135deg, #3a2a1a 0%, #b87333 100%)',
    ];
    return gradients[(id - 1) % gradients.length];
  }

  getIcon(id: number): string {
    const icons = ['⚡', '🤖', '📊', '☁️', '🎯', '🔧'];
    return icons[(id - 1) % icons.length];
  }
}
