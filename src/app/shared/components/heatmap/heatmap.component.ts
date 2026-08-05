import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="heatmap-container">
      <div class="heatmap-header">
        <h3 class="chart-title" *ngIf="title">{{ title }}</h3>
        <span class="total-badge">{{ totalContributions }} contributions in the last year</span>
      </div>

      <div class="grid-scroll-wrapper">
        <div class="heatmap-grid">
          <div
            *ngFor="let cell of generateGrid(); let i = index"
            class="heatmap-cell"
            [attr.data-level]="cell.level"
            (mouseenter)="hoverCell.set(cell)"
            (mouseleave)="hoverCell.set(null)"
          ></div>
        </div>
      </div>

      <!-- LEGEND -->
      <div class="heatmap-footer">
        <span class="legend-lbl">Less</span>
        <div class="legend-cells">
          <span class="heatmap-cell" data-level="0"></span>
          <span class="heatmap-cell" data-level="1"></span>
          <span class="heatmap-cell" data-level="2"></span>
          <span class="heatmap-cell" data-level="3"></span>
          <span class="heatmap-cell" data-level="4"></span>
        </div>
        <span class="legend-lbl">More</span>
      </div>

      <!-- HOVER TOOLTIP -->
      <div class="heatmap-tooltip" *ngIf="hoverCell()">
        <strong>{{ hoverCell()?.count }} contributions</strong> on {{ hoverCell()?.date }}
      </div>
    </div>
  `,
  styles: [`
    .heatmap-container {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      position: relative;
    }

    .heatmap-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chart-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0;
    }

    .total-badge {
      font-size: 0.8rem;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.12);
      padding: 0.25rem 0.65rem;
      border-radius: 100px;
      font-weight: 600;
    }

    .grid-scroll-wrapper {
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .heatmap-grid {
      display: grid;
      grid-template-rows: repeat(7, 10px);
      grid-auto-flow: column;
      grid-auto-columns: 10px;
      gap: 3px;
    }

    .heatmap-cell {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      transition: transform 0.15s, filter 0.15s;
      cursor: pointer;

      &[data-level="0"] { background: rgba(255, 255, 255, 0.06); }
      &[data-level="1"] { background: #0E4429; }
      &[data-level="2"] { background: #006D32; }
      &[data-level="3"] { background: #26A641; }
      &[data-level="4"] { background: #39D353; }

      &:hover {
        transform: scale(1.3);
        filter: brightness(1.2);
        z-index: 10;
      }
    }

    .heatmap-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.4rem;
      margin-top: 0.75rem;

      .legend-lbl {
        font-size: 0.7rem;
        color: #94A3B8;
      }

      .legend-cells {
        display: flex;
        gap: 3px;
      }
    }

    .heatmap-tooltip {
      position: absolute;
      bottom: 12px;
      left: 20px;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-radius: 6px;
      padding: 0.4rem 0.7rem;
      font-size: 0.75rem;
      color: #E2E8F0;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
  `]
})
export class HeatmapComponent {
  @Input() title = '';
  @Input() totalContributions = 418;

  hoverCell = signal<HeatmapCell | null>(null);

  generateGrid(): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const today = new Date();
    
    // Generate 52 weeks * 7 days = 364 days of sample contribution data
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Pseudo random deterministic count based on date string hash
      const hash = (dateStr.split('-').reduce((acc, part) => acc + parseInt(part), 0) + i * 3) % 17;
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (hash > 5) {
        count = hash - 4;
        if (count > 10) level = 4;
        else if (count > 6) level = 3;
        else if (count > 3) level = 2;
        else level = 1;
      }

      cells.push({ date: dateStr, count, level });
    }

    return cells;
  }
}
