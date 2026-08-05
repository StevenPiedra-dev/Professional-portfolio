import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-tech-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tech-card" [class.hovered]="isHovered()" (mouseenter)="isHovered.set(true)" (mouseleave)="isHovered.set(false)">
      <div class="card-header">
        <div class="tech-badge" [attr.data-category]="skill.category">
          {{ skill.category }}
        </div>
        <span class="percentage">{{ skill.level }}%</span>
      </div>

      <div class="card-body">
        <h4 class="tech-name">{{ skill.name }}</h4>
        <p class="tech-desc" *ngIf="skill.description">{{ skill.description }}</p>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-fill" [style.width.%]="skill.level" [attr.data-category]="skill.category"></div>
      </div>

      <!-- TOOLTIP -->
      <div class="tech-tooltip" *ngIf="isHovered()">
        <span class="tooltip-title">{{ skill.name }} &bull; {{ skill.level }}%</span>
        <span class="tooltip-body">{{ skill.description || 'Proficient in production environments.' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .tech-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
        background: rgba(15, 23, 42, 0.8);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .tech-badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.6rem;
      border-radius: 100px;
      background: rgba(59, 130, 246, 0.15);
      color: #60A5FA;
      border: 1px solid rgba(59, 130, 246, 0.3);

      &[data-category="frontend"] { background: rgba(59, 130, 246, 0.15); color: #60A5FA; }
      &[data-category="backend"] { background: rgba(16, 185, 129, 0.15); color: #34D399; border-color: rgba(16, 185, 129, 0.3); }
      &[data-category="databases"] { background: rgba(168, 85, 247, 0.15); color: #C084FC; border-color: rgba(168, 85, 247, 0.3); }
      &[data-category="cloud"] { background: rgba(245, 158, 11, 0.15); color: #FBBF24; border-color: rgba(245, 158, 11, 0.3); }
      &[data-category="tools"] { background: rgba(236, 72, 153, 0.15); color: #F472B6; border-color: rgba(236, 72, 153, 0.3); }
      &[data-category="methodologies"] { background: rgba(14, 165, 233, 0.15); color: #38BDF8; border-color: rgba(14, 165, 233, 0.3); }
    }

    .percentage {
      font-size: 0.85rem;
      font-weight: 700;
      color: #F8FAFC;
    }

    .tech-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #FFF;
      margin: 0 0 0.35rem 0;
    }

    .tech-desc {
      font-size: 0.8rem;
      color: #94A3B8;
      margin: 0 0 0.85rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .progress-bar-container {
      height: 6px;
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 100px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, #3B82F6, #60A5FA);
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);

      &[data-category="backend"] { background: linear-gradient(90deg, #059669, #34D399); }
      &[data-category="databases"] { background: linear-gradient(90deg, #7C3AED, #C084FC); }
      &[data-category="cloud"] { background: linear-gradient(90deg, #D97706, #FBBF24); }
      &[data-category="tools"] { background: linear-gradient(90deg, #DB2777, #F472B6); }
      &[data-category="methodologies"] { background: linear-gradient(90deg, #0284C7, #38BDF8); }
    }

    .tech-tooltip {
      position: absolute;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.5);
      z-index: 20;
      pointer-events: none;

      .tooltip-title {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #60A5FA;
        margin-bottom: 0.2rem;
      }

      .tooltip-body {
        display: block;
        font-size: 0.7rem;
        color: #CBD5E1;
        line-height: 1.3;
      }
    }
  `]
})
export class TechCardComponent {
  @Input({ required: true }) skill!: Skill;
  isHovered = signal(false);
}
