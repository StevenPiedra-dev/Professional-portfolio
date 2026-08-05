import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarData {
  label: string;
  value: number;
  color?: string;
  category?: string;
}

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-bar-container">
      <h3 class="chart-title" *ngIf="title">{{ title }}</h3>

      <div class="bars-list">
        <div 
          *ngFor="let item of data; let i = index" 
          class="bar-row"
          (mouseenter)="activeHover.set(i)"
          (mouseleave)="activeHover.set(null)"
        >
          <div class="bar-info">
            <span class="bar-label">{{ item.label }}</span>
            <span class="bar-val">{{ item.value }}%</span>
          </div>

          <div class="bar-track">
            <div 
              class="bar-fill" 
              [style.width.%]="item.value"
              [style.background]="item.color || defaultColors[i % defaultColors.length]"
              [class.highlight]="activeHover() === i"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-bar-container {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .chart-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0 0 1.25rem 0;
      letter-spacing: -0.01em;
    }

    .bars-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bar-row {
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .bar-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .bar-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #CBD5E1;
    }

    .bar-val {
      font-size: 0.85rem;
      font-weight: 700;
      color: #60A5FA;
    }

    .bar-track {
      height: 10px;
      width: 100%;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 100px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 100px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s, filter 0.2s;

      &.highlight {
        filter: brightness(1.25);
        transform: scaleY(1.2);
      }
    }
  `]
})
export class ChartBarComponent {
  @Input() title = '';
  @Input() data: BarData[] = [];

  activeHover = signal<number | null>(null);

  defaultColors = [
    'linear-gradient(90deg, #3B82F6, #60A5FA)',
    'linear-gradient(90deg, #10B981, #34D399)',
    'linear-gradient(90deg, #8B5CF6, #C084FC)',
    'linear-gradient(90deg, #F59E0B, #FBBF24)',
    'linear-gradient(90deg, #EC4899, #F472B6)'
  ];
}
