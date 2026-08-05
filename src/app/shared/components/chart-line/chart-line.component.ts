import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PointData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-line-container">
      <h3 class="chart-title" *ngIf="title">{{ title }}</h3>

      <div class="svg-container">
        <svg viewBox="0 0 400 160" preserveAspectRatio="none" class="line-svg">
          <!-- GRID LINES -->
          <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />
          <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />

          <!-- GRADIENT AREA FILL -->
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path [attr.d]="areaPath()" fill="url(#lineGrad)" />

          <!-- MAIN PATH -->
          <path [attr.d]="linePath()" fill="none" stroke="#60A5FA" stroke-width="3" stroke-linecap="round" />

          <!-- INTERACTIVE DOTS -->
          <g *ngFor="let pt of calculatedPoints(); let i = index">
            <circle
              [attr.cx]="pt.x"
              [attr.cy]="pt.y"
              r="5"
              fill="#0F172A"
              stroke="#60A5FA"
              stroke-width="2.5"
              class="point-circle"
              [class.highlight]="activeHover() === i"
              (mouseenter)="activeHover.set(i)"
              (mouseleave)="activeHover.set(null)"
            />
          </g>
        </svg>

        <!-- TOOLTIP ON HOVER -->
        <div 
          *ngIf="activeHover() !== null" 
          class="hover-tooltip"
          [style.left.%]="(calculatedPoints()[activeHover()!].x / 400) * 100"
        >
          <span class="tooltip-lbl">{{ data[activeHover()!].label }}</span>
          <span class="tooltip-val">{{ data[activeHover()!].value }} commits</span>
        </div>
      </div>

      <!-- X-AXIS LABELS -->
      <div class="x-axis">
        <span *ngFor="let item of data">{{ item.label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .chart-line-container {
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

    .svg-container {
      position: relative;
      width: 100%;
      height: 140px;
    }

    .line-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .point-circle {
      cursor: pointer;
      transition: r 0.2s, stroke-width 0.2s, filter 0.2s;

      &.highlight {
        r: 7;
        stroke: #3B82F6;
        stroke-width: 3;
        filter: drop-shadow(0 0 8px #3B82F6);
      }
    }

    .hover-tooltip {
      position: absolute;
      top: -10px;
      transform: translate(-50%, -100%);
      background: #0F172A;
      border: 1px solid #3B82F6;
      border-radius: 6px;
      padding: 0.3rem 0.6rem;
      box-shadow: 0 8px 16px rgba(0,0,0,0.4);
      pointer-events: none;
      white-space: nowrap;

      .tooltip-lbl {
        display: block;
        font-size: 0.65rem;
        color: #94A3B8;
      }

      .tooltip-val {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #60A5FA;
      }
    }

    .x-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding: 0 0.5rem;

      span {
        font-size: 0.75rem;
        color: #94A3B8;
        font-weight: 500;
      }
    }
  `]
})
export class ChartLineComponent {
  @Input() title = '';
  @Input() data: PointData[] = [];

  activeHover = signal<number | null>(null);

  calculatedPoints() {
    if (!this.data || this.data.length === 0) return [];

    const maxVal = Math.max(...this.data.map(d => d.value), 10);
    const minVal = 0;
    const width = 400;
    const height = 130;
    const paddingY = 15;

    const step = width / (this.data.length - 1 || 1);

    return this.data.map((item, i) => {
      const x = i * step;
      const normalizedY = (item.value - minVal) / (maxVal - minVal);
      const y = height - paddingY - (normalizedY * (height - 2 * paddingY));
      return { x, y };
    });
  }

  linePath(): string {
    const pts = this.calculatedPoints();
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  }

  areaPath(): string {
    const pts = this.calculatedPoints();
    if (pts.length === 0) return '';
    const line = this.linePath();
    const lastX = pts[pts.length - 1].x;
    return `${line} L ${lastX} 140 L 0 140 Z`;
  }
}
