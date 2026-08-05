import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-chart-donut',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-donut-container">
      <h3 class="chart-title" *ngIf="title">{{ title }}</h3>

      <div class="donut-content">
        <!-- SVG DONUT -->
        <div class="svg-wrapper">
          <svg viewBox="0 0 100 100" class="donut-svg">
            <circle 
              *ngFor="let seg of preparedSegments(); let i = index"
              cx="50" cy="50" r="38"
              fill="transparent"
              [attr.stroke]="seg.color"
              stroke-width="16"
              [attr.stroke-dasharray]="seg.dashArray"
              [attr.stroke-dashoffset]="seg.dashOffset"
              class="donut-segment"
              [class.highlight]="activeHover() === i"
              (mouseenter)="activeHover.set(i)"
              (mouseleave)="activeHover.set(null)"
            />
          </svg>

          <div class="donut-center-text">
            <span class="total-val">{{ totalValue() }}</span>
            <span class="total-label">Technologies</span>
          </div>
        </div>

        <!-- LEGEND -->
        <div class="legend-list">
          <div 
            *ngFor="let seg of segments; let i = index"
            class="legend-item"
            [class.active]="activeHover() === i"
            (mouseenter)="activeHover.set(i)"
            (mouseleave)="activeHover.set(null)"
          >
            <span class="legend-dot" [style.background]="seg.color"></span>
            <span class="legend-name">{{ seg.label }}</span>
            <span class="legend-val">{{ getPercentage(seg.value) }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-donut-container {
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
    }

    .donut-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      @media (min-width: 640px) {
        flex-direction: row;
        justify-content: space-around;
      }
    }

    .svg-wrapper {
      position: relative;
      width: 160px;
      height: 160px;
      flex-shrink: 0;
    }

    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      border-radius: 50%;
    }

    .donut-segment {
      transition: stroke-width 0.2s, filter 0.2s;
      cursor: pointer;

      &.highlight {
        stroke-width: 19;
        filter: brightness(1.3);
      }
    }

    .donut-center-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;

      .total-val {
        display: block;
        font-size: 1.75rem;
        font-weight: 800;
        color: #F8FAFC;
        line-height: 1;
      }

      .total-label {
        display: block;
        font-size: 0.7rem;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 2px;
      }
    }

    .legend-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      width: 100%;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      transition: background 0.2s;

      &.active, &:hover {
        background: rgba(255, 255, 255, 0.06);
      }
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-name {
      color: #CBD5E1;
      font-weight: 500;
      flex-grow: 1;
    }

    .legend-val {
      color: #60A5FA;
      font-weight: 700;
    }
  `]
})
export class ChartDonutComponent {
  @Input() title = '';
  @Input() segments: DonutSegment[] = [];

  activeHover = signal<number | null>(null);

  totalValue(): number {
    return this.segments.reduce((acc, curr) => acc + curr.value, 0);
  }

  getPercentage(val: number): number {
    const total = this.totalValue();
    return total ? Math.round((val / total) * 100) : 0;
  }

  preparedSegments() {
    const circumference = 2 * Math.PI * 38; // ~238.76
    const total = this.totalValue();
    let accumulated = 0;

    return this.segments.map(seg => {
      const ratio = total ? seg.value / total : 0;
      const strokeLength = ratio * circumference;
      const spaceLength = circumference - strokeLength;
      const dashOffset = -accumulated * circumference;
      accumulated += ratio;

      return {
        ...seg,
        dashArray: `${strokeLength} ${spaceLength}`,
        dashOffset
      };
    });
  }
}
