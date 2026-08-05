import { Component, Input, ElementRef, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-card" [class.visible]="isVisible()">
      <div class="card-icon" [innerHTML]="iconSvg"></div>
      <div class="counter-value">
        <span class="number">{{ currentCount() }}</span>
        <span class="suffix" *ngIf="suffix">{{ suffix }}</span>
      </div>
      <p class="counter-label">{{ label }}</p>
    </div>
  `,
  styles: [`
    .counter-card {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem 1.25rem;
      text-align: center;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-6px);
        border-color: rgba(59, 130, 246, 0.35);
        box-shadow: 0 12px 30px -10px rgba(59, 130, 246, 0.25);

        .card-icon {
          transform: scale(1.15) rotate(5deg);
          color: #60A5FA;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #3B82F6, transparent);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover::before {
        opacity: 1;
      }
    }

    .card-icon {
      font-size: 2rem;
      color: #3B82F6;
      margin-bottom: 0.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, color 0.3s ease;
      
      svg {
        width: 32px;
        height: 32px;
        fill: currentColor;
      }
    }

    .counter-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #F8FAFC;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 0.35rem;

      .suffix {
        color: #3B82F6;
        margin-left: 2px;
      }
    }

    .counter-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
  `]
})
export class CounterCardComponent implements OnInit, OnDestroy {
  @Input() targetValue = 0;
  @Input() label = '';
  @Input() suffix = '+';
  @Input() iconSvg = '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
  @Input() duration = 1500;

  currentCount = signal(0);
  isVisible = signal(false);

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isVisible()) {
        this.isVisible.set(true);
        this.animateCount();
      }
    }, { threshold: 0.2 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private animateCount() {
    const start = 0;
    const end = this.targetValue;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(easedProgress * (end - start) + start);

      this.currentCount.set(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        this.currentCount.set(end);
      }
    };

    requestAnimationFrame(updateCount);
  }
}
