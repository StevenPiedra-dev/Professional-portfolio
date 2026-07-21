import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="particles-container" aria-hidden="true">
      <div
        *ngFor="let p of particles; let i = index"
        class="particle"
        [style.left.px]="p.x"
        [style.top.px]="p.y"
        [style.width.px]="p.size"
        [style.height.px]="p.size"
        [style.opacity]="p.opacity"
        [style.background]="p.color"
        [style.animationDelay]="(i * 0.3) + 's'"
        [style.animationDuration]="(4 + i * 0.5) + 's'"
      ></div>
    </div>
  `,
  styles: [`
    .particles-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }
    .particle {
      position: absolute;
      border-radius: 50%;
      animation: floatParticle ease-in-out infinite alternate;
    }
    @keyframes floatParticle {
      0% { transform: translateY(0) translateX(0) scale(1); }
      100% { transform: translateY(-40px) translateX(20px) scale(1.2); }
    }
  `]
})
export class ParticlesComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  private animFrame?: number;

  private colors = [
    'rgba(74, 144, 217, 0.15)',
    'rgba(100, 181, 246, 0.12)',
    'rgba(147, 197, 253, 0.10)',
    'rgba(59, 130, 246, 0.08)',
  ];

  ngOnInit(): void {
    this.generateParticles();
  }

  ngOnDestroy(): void {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  private generateParticles(): void {
    const count = 18;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 60 + 10,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.5 + 0.2),
        opacity: Math.random() * 0.4 + 0.05,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }
}
