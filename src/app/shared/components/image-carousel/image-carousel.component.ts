import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel-container">
      <div class="carousel-slide" *ngFor="let img of imageList; let i = index" [class.active]="currentIndex === i">
        <img [src]="img" [alt]="'Project Image ' + (i + 1)" (error)="onImgError($event)" />
      </div>

      <!-- Navigation Arrows -->
      <button *ngIf="imageList.length > 1" class="carousel-btn prev" (click)="prev($event)" aria-label="Previous image">
        ❮
      </button>
      <button *ngIf="imageList.length > 1" class="carousel-btn next" (click)="next($event)" aria-label="Next image">
        ❯
      </button>

      <!-- Dots Indicator -->
      <div *ngIf="imageList.length > 1" class="carousel-dots">
        <span 
          *ngFor="let img of imageList; let i = index" 
          class="dot" 
          [class.active]="currentIndex === i"
          (click)="goTo(i, $event)">
        </span>
      </div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      width: 100%;
      height: 240px;
      border-radius: 12px;
      overflow: hidden;
      background: #0F172A;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .carousel-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-slide.active {
      opacity: 1;
      z-index: 1;
    }

    .carousel-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      background: rgba(15, 23, 42, 0.75);
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.4);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
    }

    .carousel-btn:hover {
      background: #3B82F6;
      color: #FFF;
      box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
    }

    .carousel-btn.prev { left: 12px; }
    .carousel-btn.next { right: 12px; }

    .carousel-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      display: flex;
      gap: 8px;
      background: rgba(11, 19, 43, 0.6);
      padding: 4px 10px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dot.active {
      background: #38BDF8;
      width: 16px;
      border-radius: 8px;
      box-shadow: 0 0 8px #38BDF8;
    }
  `]
})
export class ImageCarouselComponent {
  @Input() images: string[] = [];
  @Input() fallbackImage: string = 'assets/projects/ecommerce.jpg';

  currentIndex: number = 0;

  get imageList(): string[] {
    if (this.images && this.images.length > 0) {
      return this.images.slice(0, 3);
    }
    return [this.fallbackImage];
  }

  prev(event: MouseEvent): void {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex - 1 + this.imageList.length) % this.imageList.length;
  }

  next(event: MouseEvent): void {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.imageList.length;
  }

  goTo(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.currentIndex = index;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop';
  }
}
