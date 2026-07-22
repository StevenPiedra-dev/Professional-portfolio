import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="subpage-container">
      <div class="subpage-header">
        <span class="subpage-badge">Artículos y Noticias</span>
        <h1>My blog</h1>
        <p class="subpage-subtitle">Publicaciones sobre desarrollo Fullstack, tendencias en IA y diseño de productos.</p>
      </div>
    </main>
  `,
  styles: [`
    .subpage-container {
      min-height: calc(100vh - var(--nav-height) - 150px);
      padding: 6rem 1.5rem 4rem 1.5rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .subpage-header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { font-size: 2.5rem; color: #FFF; margin: 0.5rem 0; }
      .subpage-badge {
        font-size: 0.8rem; font-weight: 600; color: var(--blue-400);
        background: rgba(59,130,246,0.12); padding: 0.3rem 0.8rem; border-radius: 100px;
      }
      .subpage-subtitle { color: var(--text-secondary); max-width: 600px; margin: 0 auto; }
    }
  `]
})
export class BlogComponent {}
