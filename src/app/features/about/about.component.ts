import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Skill } from '../../core/models/portfolio.models';
import { TechCardComponent } from '../../shared/components/tech-card/tech-card.component';
import { ChartBarComponent, BarData } from '../../shared/components/chart-bar/chart-bar.component';
import { ChartDonutComponent, DonutSegment } from '../../shared/components/chart-donut/chart-donut.component';

interface TimelineEvent {
  year: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  icon: string;
  type: 'work' | 'education' | 'project';
}

interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TechCardComponent, ChartBarComponent, ChartDonutComponent],
  template: `
    <main class="about-page">

      <!-- ── Hero Bio ── -->
      <section class="about-hero">
        <div class="hero-bg-pattern"></div>
        <div class="hero-inner">
          <div class="avatar-col">
            <div class="avatar-ring">
              <div class="avatar-inner">
                <span class="avatar-initials">SP</span>
              </div>
              <div class="avatar-status"></div>
            </div>
            <div class="avatar-social">
              <a href="https://github.com/StevenPiedra-dev" target="_blank" rel="noopener" class="social-icon-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/stevenpiedra/" target="_blank" rel="noopener" class="social-icon-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:steven.piedra02@gmail.com" class="social-icon-btn" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          <div class="bio-col">
            <span class="badge">About me</span>
            <h1>{{ aboutInfo().fullName ? (aboutInfo().fullName.split(' ')[0]) : 'Steven' }} <span class="gradient-text">{{ aboutInfo().fullName ? (aboutInfo().fullName.split(' ').slice(1).join(' ')) : 'Piedra Villalta' }}</span></h1>
            <p class="bio-roles">
              <span class="role-chip">⚡ Full Stack Developer</span>
              <span class="role-chip">📊 Data Analyst</span>
            </p>
            <p class="bio-text">
              {{ aboutInfo().bioParagraph1 || 'Data Analyst and Full Stack Developer with experience in data analysis and full-stack development. Experienced in data collection and quantitative and qualitative analysis, using tools such as SQL, Python, Power BI, Tableau, and Excel.' }}
            </p>
            <p class="bio-text">
              {{ aboutInfo().bioParagraph2 || 'Experienced in payment methods and emerging technologies, as well as tools such as .NET Core, React, REST API, Microservices, Azure Database, and MySQL. Deeply passionate about data and how technology enhances business performance and enables more efficient delivery.' }}
            </p>

            <div class="bio-metrics">
              <div class="bio-metric">
                <span class="metric-num">{{ aboutInfo().experienceYears || 4 }}+</span>
                <span class="metric-label">Years of Experience</span>
              </div>
              <div class="bio-divider"></div>
              <div class="bio-metric">
                <span class="metric-num">{{ skills().length }}+</span>
                <span class="metric-label">Technologies</span>
              </div>
              <div class="bio-divider"></div>
              <div class="bio-metric">
                <span class="metric-num">{{ aboutInfo().completedProjectsCount || 10 }}+</span>
                <span class="metric-label">Completed Projects</span>
              </div>
            </div>

            <div class="bio-actions">
              <a [href]="aboutInfo().githubUrl || 'https://github.com/StevenPiedra-dev'" target="_blank" rel="noopener" class="btn-primary">
                View GitHub
              </a>
              <a [href]="aboutInfo().cvUrl || 'assets/CV_Steven_Piedra.pdf'" target="_blank" [download]="aboutInfo().cvFileName || 'CV_Steven_Piedra.pdf'" class="btn-outline">
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Values ── -->
      <section class="values-section">
        <div class="section-container">
          <div class="values-grid">
            <div class="value-card" *ngFor="let v of values">
              <div class="value-icon">{{ v.icon }}</div>
              <h3 class="value-title">{{ v.title }}</h3>
              <p class="value-desc">{{ v.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Skills & Charts ── -->
      <section class="skills-section">
        <div class="section-container">
          <div class="section-head">
            <span class="section-badge">Technical Skills</span>
            <h2 class="section-title">Stack & Competencies</h2>
            <p class="section-subtitle">A detailed look at the technologies I use on a daily basis.</p>
          </div>

          <!-- Category Filter -->
          <div class="skill-filters">
            <button
              *ngFor="let cat of skillCategories"
              class="skill-filter-btn"
              [class.active]="activeSkillCat() === cat.id"
              (click)="activeSkillCat.set(cat.id)"
            >
              <span>{{ cat.icon }}</span>
              {{ cat.label }}
            </button>
          </div>

          <!-- Skills Grid -->
          <div class="skills-cards-grid">
            <div
              *ngFor="let skill of filteredSkills()"
              class="skill-item-card"
            >
              <div class="skill-item-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level-badge" [style.color]="getLevelColor(skill.level)">{{ getLevelLabel(skill.level) }}</span>
              </div>
              <div class="skill-bar-track">
                <div
                  class="skill-bar-fill"
                  [style.width.%]="skill.level"
                  [style.background]="getLevelGradient(skill.level)"
                ></div>
              </div>
              <p class="skill-desc" *ngIf="skill.description">{{ skill.description }}</p>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="charts-row">
            <app-chart-donut
              title="Stack Distribution"
              [segments]="donutSegments()"
            ></app-chart-donut>
            <app-chart-bar
              title="Top Skills"
              [data]="barData()"
            ></app-chart-bar>
          </div>
        </div>
      </section>

      <!-- ── Timeline ── -->
      <section class="timeline-section">
        <div class="section-container">
          <div class="section-head">
            <span class="section-badge">Journey</span>
            <h2 class="section-title">Experience & Education</h2>
            <p class="section-subtitle">My professional and academic path so far.</p>
          </div>

          <div class="timeline">
            <div
              *ngFor="let event of timeline; let i = index"
              class="timeline-item"
              [class.left]="i % 2 === 0"
              [class.right]="i % 2 !== 0"
              [class.work]="event.type === 'work'"
              [class.education]="event.type === 'education'"
            >
              <div class="timeline-dot">
                <img *ngIf="getCompanyLogo(event)" [src]="getCompanyLogo(event)" [alt]="event.company" class="company-logo-img" />
                <span *ngIf="!getCompanyLogo(event)">{{ event.icon || '💼' }}</span>
              </div>
              <div class="timeline-card">
                <div class="timeline-card-header">
                  <div>
                    <span class="timeline-period">{{ event.period }}</span>
                    <h3 class="timeline-role">{{ event.role }}</h3>
                    <p class="timeline-company">{{ event.company }}</p>
                  </div>
                  <span class="timeline-year">{{ event.year }}</span>
                </div>
                <p class="timeline-desc">{{ event.description }}</p>
                <div class="timeline-tags">
                  <span *ngFor="let tag of event.tags" class="timeline-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Education & Certifications ── -->
      <section class="certs-section">
        <div class="section-container">
          <div class="section-head">
            <span class="section-badge">Education</span>
            <h2 class="section-title">Certifications & Education</h2>
          </div>
          <div class="certs-grid">
            <div class="cert-card" *ngFor="let cert of certifications">
              <div class="cert-icon">{{ cert.icon }}</div>
              <div class="cert-info">
                <h4 class="cert-name">{{ cert.name }}</h4>
                <p class="cert-issuer">{{ cert.issuer }}</p>
                <span class="cert-year">{{ cert.year }}</span>
              </div>
              <div class="cert-badge" [class]="cert.level">{{ cert.level }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA ── -->
      <section class="about-cta">
        <div class="cta-inner">
          <div class="cta-text">
            <h2>Ready to collaborate?</h2>
            <p>Open to job opportunities, freelance projects, and collaborations.</p>
          </div>
          <div class="cta-actions">
            <a href="mailto:steven.piedra02@gmail.com" class="cta-btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Send Message
            </a>
            <a [routerLink]="['/projects']" class="cta-btn secondary">View Projects →</a>
          </div>
        </div>
      </section>

    </main>
  `,
  styles: [`
    /* ── Layout ── */
    .about-page {
      min-height: 100vh;
      padding-top: var(--nav-height);
    }

    .section-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* ── Hero ── */
    .about-hero {
      position: relative;
      padding: 4rem 1.5rem 5rem;
      overflow: hidden;
    }

    .hero-bg-pattern {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-inner {
      position: relative;
      z-index: 1;
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-start;
      }
    }

    /* Avatar */
    .avatar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      flex-shrink: 0;
    }

    .avatar-ring {
      position: relative;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, #3B82F6, #A78BFA, #38BDF8);
    }

    .avatar-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a3a5c, #0f172a);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-initials {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #60A5FA, #A78BFA);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .avatar-status {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: #22C55E;
      border-radius: 50%;
      border: 3px solid var(--bg-main);
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
      50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
    }

    .avatar-social {
      display: flex;
      gap: 0.75rem;
    }

    .social-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      transition: all 0.2s;

      svg { width: 18px; height: 18px; }

      &:hover {
        background: rgba(59,130,246,0.15);
        border-color: var(--blue-500);
        color: var(--blue-400);
        transform: translateY(-2px);
      }
    }

    /* Bio */
    .bio-col {
      flex: 1;
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
      margin-bottom: 1rem;
    }

    .bio-col h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .bio-roles {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .role-chip {
      display: inline-block;
      padding: 0.3rem 0.85rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .bio-text {
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 1rem;
      font-size: 0.95rem;

      strong { color: var(--text-primary); }
    }

    .bio-metrics {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin: 1.5rem 0;
      flex-wrap: wrap;
    }

    .bio-metric {
      display: flex;
      flex-direction: column;
    }

    .metric-num {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--blue-400);
      line-height: 1;
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .bio-divider {
      width: 1px;
      height: 40px;
      background: var(--border-subtle);
    }

    .bio-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      background: var(--blue-500);
      color: #fff;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s;

      &:hover {
        background: var(--blue-600);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59,130,246,0.3);
      }
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border-medium);
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s;

      &:hover {
        background: rgba(59,130,246,0.1);
        border-color: var(--blue-500);
        transform: translateY(-2px);
      }
    }

    /* ── Values ── */
    .values-section {
      padding: 4rem 1.5rem;
      background: var(--bg-section-alt);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .values-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      max-width: 1100px;
      margin: 0 auto;

      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
    }

    .value-card {
      padding: 1.75rem;
      background: rgba(15,23,42,0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      backdrop-filter: blur(8px);
      transition: transform 0.3s, border-color 0.3s;

      &:hover {
        transform: translateY(-4px);
        border-color: var(--border-medium);
      }
    }

    .value-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .value-title {
      font-size: 1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
    }

    .value-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* ── Skills Section ── */
    .skills-section {
      padding: 5rem 0;
    }

    .section-head {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--blue-400);
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      padding: 0.25rem 0.85rem;
      border-radius: 100px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 0.75rem;
    }

    .section-subtitle {
      color: var(--text-secondary);
      max-width: 500px;
      margin: 0 auto;
    }

    /* Skill Filters */
    .skill-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    .skill-filter-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(59,130,246,0.1);
        border-color: rgba(59,130,246,0.3);
        color: var(--text-primary);
      }

      &.active {
        background: rgba(59,130,246,0.15);
        border-color: var(--blue-500);
        color: var(--blue-400);
      }
    }

    /* Skills Grid */
    .skills-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 3rem;

      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .skill-item-card {
      padding: 1.25rem;
      background: rgba(15,23,42,0.5);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      transition: border-color 0.2s, transform 0.2s;

      &:hover {
        border-color: var(--border-medium);
        transform: translateY(-2px);
      }
    }

    .skill-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .skill-name {
      font-weight: 600;
      color: #F8FAFC;
      font-size: 0.9rem;
    }

    .skill-level-badge {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .skill-bar-track {
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }

    .skill-bar-fill {
      height: 100%;
      border-radius: 100px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .skill-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Charts */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
    }

    /* ── Timeline ── */
    .timeline-section {
      padding: 5rem 0;
      background: var(--bg-section-alt);
      border-top: 1px solid var(--border-subtle);
    }

    .timeline {
      position: relative;
      margin-top: 1rem;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, var(--blue-500) 0%, transparent 100%);
        transform: translateX(-50%);

        @media (max-width: 767px) {
          left: 20px;
        }
      }
    }

    .timeline-item {
      position: relative;
      display: flex;
      justify-content: flex-end;
      padding-right: calc(50% + 2.5rem);
      margin-bottom: 2rem;

      &.right {
        justify-content: flex-start;
        padding-right: 0;
        padding-left: calc(50% + 2.5rem);
      }

      @media (max-width: 767px) {
        padding-right: 0;
        padding-left: 3.5rem;
        justify-content: flex-start;

        &.right {
          padding-left: 3.5rem;
        }
      }
    }

    .timeline-dot {
      position: absolute;
      left: 50%;
      top: 1rem;
      transform: translateX(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--surface-card);
      border: 2px solid var(--blue-500);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      z-index: 1;
      overflow: hidden;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.25);

      .company-logo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      @media (max-width: 767px) {
        left: 0;
        transform: none;
      }
    }

    .timeline-card {
      background: rgba(15,23,42,0.7);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.25rem;
      max-width: 440px;
      width: 100%;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s;

      &:hover { border-color: var(--border-medium); }
    }

    .timeline-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
      gap: 1rem;
    }

    .timeline-period {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--blue-400);
      font-weight: 600;
    }

    .timeline-role {
      font-size: 1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0.2rem 0 0.1rem;
    }

    .timeline-company {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .timeline-year {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      background: rgba(255,255,255,0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      white-space: nowrap;
    }

    .timeline-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 0.75rem;
    }

    .timeline-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .timeline-tag {
      padding: 0.15rem 0.55rem;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--blue-300);
    }

    /* ── Certs ── */
    .certs-section {
      padding: 5rem 0;
    }

    .certs-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .cert-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(15,23,42,0.5);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      transition: all 0.2s;

      &:hover {
        border-color: var(--border-medium);
        transform: translateY(-2px);
      }
    }

    .cert-icon { font-size: 2rem; flex-shrink: 0; }

    .cert-info { flex: 1; }

    .cert-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.15rem;
    }

    .cert-issuer {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .cert-year {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .cert-badge {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;

      &.Expert, &.Advanced, &.Completed {
        color: #60A5FA;
        background: rgba(96,165,250,0.12);
        border: 1px solid rgba(96,165,250,0.25);
      }
      &.Intermediate, &.In-Progress {
        color: #34D399;
        background: rgba(52,211,153,0.12);
        border: 1px solid rgba(52,211,153,0.25);
      }
      &.Basic {
        color: #FBBF24;
        background: rgba(251,191,36,0.12);
        border: 1px solid rgba(251,191,36,0.25);
      }
    }

    /* ── CTA ── */
    .about-cta {
      padding: 5rem 1.5rem;
      background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(167,139,250,0.06) 100%);
      border-top: 1px solid var(--border-subtle);
    }

    .cta-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;

      @media (min-width: 768px) {
        flex-direction: row;
        text-align: left;
        justify-content: space-between;
        align-items: center;
      }
    }

    .cta-text h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
    }

    .cta-text p { color: var(--text-secondary); }

    .cta-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      flex-shrink: 0;
      justify-content: center;
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-size: 0.9rem;
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
        }
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  private portfolioService = inject(PortfolioService);

  skills = this.portfolioService.skillsSignal;
  activeSkillCat = signal<string>('all');

  // Reactive about info from service
  aboutInfo = this.portfolioService.aboutInfoSignal;

  get timeline() { return this.aboutInfo().timeline || []; }
  get certifications() { return this.aboutInfo().certifications || []; }
  get values() { return this.aboutInfo().values || this._defaultValues; }

  private _defaultValues: ValueCard[] = [
    { icon: '🏗️', title: 'Clean Code', description: 'I prioritize maintainable, scalable, and well-documented code following SOLID principles and Clean Architecture.' },
    { icon: '🚀', title: 'Continuous Delivery', description: 'Agile methodologies and CI/CD to deliver value quickly and incrementally to the client.' },
    { icon: '🤖', title: 'AI-Driven', description: 'I integrate AI capabilities to build intelligent solutions that solve complex problems.' },
    { icon: '👥', title: 'Collaboration', description: 'I believe in teamwork, open communication, and collective growth to achieve great goals.' }
  ];

  skillCategories = [
    { id: 'all', label: 'All', icon: '🗂️' },
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'databases', label: 'Databases', icon: '🗄️' },
    { id: 'cloud', label: 'Cloud', icon: '☁️' },
    { id: 'methodologies', label: 'Methods', icon: '🎯' }
  ];

  // Computed Donut Chart from dynamic skills
  donutSegments = computed(() => {
    const allSkills = this.skills();
    const counts: Record<string, number> = {};
    allSkills.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    const colors: Record<string, string> = {
      frontend: '#60A5FA', backend: '#34D399', databases: '#C084FC',
      cloud: '#FBBF24', tools: '#F472B6', methodologies: '#38BDF8'
    };
    return Object.keys(counts).map(cat => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: counts[cat],
      color: colors[cat] || '#3B82F6'
    }));
  });

  // Computed Bar Chart from dynamic skills
  barData = computed(() => {
    const allSkills = this.skills();
    const top5 = [...allSkills].sort((a, b) => b.level - a.level).slice(0, 5);
    return top5.map(s => ({ label: s.name, value: s.level, category: s.category }));
  });

  filteredSkills() {
    const cat = this.activeSkillCat();
    if (cat === 'all') return this.skills();
    return this.skills().filter(s => s.category === cat);
  }

  ngOnInit() {
    // Auto loaded from signals
  }

  getCompanyLogo(event: any): string | null {
    if (event.companyLogo) return event.companyLogo;
    const company = (event.company || '').toLowerCase();
    if (company.includes('bac')) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23E11925"/><path d="M25 30h28c8.8 0 16 7.2 16 16s-7.2 16-16 16H25V30zm14 20h14c2.2 0 4-1.8 4-4s-1.8-4-4-4H39v8zm0 10v10h16c3.3 0 6-2.7 6-6s-2.7-6-6-6H39v2z" fill="%23ffffff"/></svg>';
    }
    if (company.includes('freelance')) {
      return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%233B82F6"/><path d="M35 32l-15 18 15 18M65 32l15 18-15 18M54 28l-8 44" stroke="%23ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    }
    return null;
  }

  getLevelLabel(level: number): string {
    if (level >= 80) return 'Expert';
    if (level >= 65) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Basic';
  }

  getLevelColor(level: number): string {
    if (level >= 80) return '#60A5FA';
    if (level >= 65) return '#34D399';
    if (level >= 50) return '#FBBF24';
    return '#F472B6';
  }

  getLevelGradient(level: number): string {
    if (level >= 80) return 'linear-gradient(90deg, #3B82F6, #60A5FA)';
    if (level >= 65) return 'linear-gradient(90deg, #10B981, #34D399)';
    if (level >= 50) return 'linear-gradient(90deg, #F59E0B, #FBBF24)';
    return 'linear-gradient(90deg, #EC4899, #F472B6)';
  }
}
