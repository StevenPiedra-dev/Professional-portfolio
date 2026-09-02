import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthService } from '../../core/services/auth.service';
import { Project, BlogPost, SiteMetrics, AboutInfo, ContactMessage } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <main class="admin-page">
      <div class="admin-container">
        
        <!-- HEADER -->
        <header class="admin-header">
          <div>
            <div class="admin-badge">⚡ Management Console</div>
            <h1>Panel Administrativo <span class="gradient-text">CRUD</span></h1>
            <p class="subtitle">Gestiona proyectos, artículos de blog y métricas del sitio en tiempo real.</p>
          </div>
          <div class="header-actions">
            <a routerLink="/" class="btn btn-outline">👁️ Ver Sitio Publico</a>
            <button class="btn btn-danger" (click)="onLogout()">🔒 Cerrar Sesión</button>
          </div>
        </header>

        <!-- TABS -->
        <div class="admin-tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'projects'" (click)="activeTab.set('projects')">
            🚀 Proyectos ({{ projects().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'blogs'" (click)="activeTab.set('blogs')">
            📝 Blog & Artículos ({{ blogs().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'metrics'" (click)="activeTab.set('metrics')">
            📊 Métricas del Home
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'about'" (click)="activeTab.set('about')">
            👤 About Me
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'contact'" (click)="activeTab.set('contact')">
            💬 Contacto ({{ contactMsgs().length }})
          </button>
        </div>

        <!-- ═══════════════════════════════════════════════
             1. PROJECTS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'projects'" class="tab-content">
          <div class="content-bar">
            <h2>Gestión de Proyectos</h2>
            <button class="btn btn-primary" (click)="openAddProjectModal()">+ Añadir Nuevo Proyecto</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Stars ⭐</th>
                  <th>Destacado</th>
                  <th>Live Demo URL</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of projects()">
                  <td>#{{ p.id }}</td>
                  <td>
                    <strong>{{ p.title }}</strong>
                    <div class="table-sub">{{ p.description | slice:0:60 }}...</div>
                  </td>
                  <td><span class="badge">{{ p.category || 'N/A' }}</span></td>
                  <td>⭐ {{ p.stars || 0 }}</td>
                  <td>{{ p.featured ? '✅ Sí' : '❌ No' }}</td>
                  <td>
                    <a *ngIf="p.liveUrl" [href]="p.liveUrl" target="_blank" class="link-sm">Enlace Demo</a>
                    <span *ngIf="!p.liveUrl" class="text-muted">Sin enlace</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-icon edit" (click)="openEditProjectModal(p)" title="Editar">✏️</button>
                      <button class="btn-icon delete" (click)="deleteProject(p.id)" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             2. BLOGS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'blogs'" class="tab-content">
          <div class="content-bar">
            <h2>Gestión de Artículos de Blog</h2>
            <button class="btn btn-primary" (click)="openAddBlogModal()">+ Añadir Nuevo Artículo</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Icono / Título</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Likes ❤️</th>
                  <th>Destacado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of blogs()">
                  <td>#{{ b.id }}</td>
                  <td>
                    <span>{{ b.icon }} <strong>{{ b.title }}</strong></span>
                  </td>
                  <td><span class="badge">{{ b.category }}</span></td>
                  <td>{{ b.date }}</td>
                  <td>❤️ {{ b.likes }}</td>
                  <td>{{ b.featured ? '⭐ Sí' : 'No' }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-icon edit" (click)="openEditBlogModal(b)" title="Editar">✏️</button>
                      <button class="btn-icon delete" (click)="deleteBlog(b.id)" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             3. METRICS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'metrics'" class="tab-content">
          <div class="content-bar">
            <h2>Actualizar Métricas y Estadísticas del Sitio</h2>
            <button class="btn btn-primary" (click)="saveMetrics()">💾 Guardar Cambios</button>
          </div>

          <div class="metrics-form-grid">
            <div class="form-card">
              <label>Repositorios Públicos en GitHub</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.githubRepos" />
            </div>

            <div class="form-card">
              <label>Commits Totales</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.totalCommits" />
            </div>

            <div class="form-card">
              <label>Seguidores GitHub</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.followers" />
            </div>

            <div class="form-card">
              <label>Artículos Publicados (Calculado)</label>
              <input type="number" class="form-input" [value]="blogs().length" disabled />
            </div>

            <div class="form-card">
              <label>Vistas del Blog</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.blogViews" />
            </div>

            <div class="form-card">
              <label>APIs Construidas</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.apisBuilt" />
            </div>

            <div class="form-card">
              <label>Tecnologías Dominadas (Tech Stack)</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.techStackMastery" />
            </div>

            <div class="form-card">
              <label>Certificaciones Profesionales</label>
              <input type="number" class="form-input" [(ngModel)]="metricsForm.professionalCerts" />
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             4. ABOUT ME TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'about'" class="tab-content">
          <div class="content-bar">
            <h2>Gestión de About Me</h2>
            <button class="btn btn-primary" (click)="saveAboutInfo()">💾 Guardar Cambios</button>
          </div>

          <div class="about-form-grid">
            <p style="color:#94A3B8; margin-bottom:1.5rem; grid-column:1/-1;">Edita toda la información que aparece en la página About Me.</p>

            <h3 class="form-section-title" style="grid-column:1/-1">👤 Información Personal</h3>
            <div class="form-card" style="grid-column: 1/-1">
              <label>Nombre Completo</label>
              <input type="text" class="form-input" [(ngModel)]="aboutForm.fullName" />
            </div>
            <div class="form-card" style="grid-column: 1/-1">
              <label>Título Profesional (en Hero/Navbar)</label>
              <input type="text" class="form-input" [(ngModel)]="aboutForm.roleTitle" placeholder="Full Stack Developer | AI Developer | Product Manager" />
            </div>
            <div class="form-card" style="grid-column: 1/-1">
              <label>Párrafo Biografía 1</label>
              <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph1" rows="3" placeholder="Data Analyst and Full Stack Developer..."></textarea>
            </div>
            <div class="form-card" style="grid-column: 1/-1">
              <label>Párrafo Biografía 2</label>
              <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph2" rows="3" placeholder="Experienced in payment methods..."></textarea>
            </div>

            <h3 class="form-section-title" style="grid-column:1/-1">📊 Métricas Hero</h3>
            <div class="form-card">
              <label>Años de Experiencia</label>
              <input type="number" class="form-input" [(ngModel)]="aboutForm.experienceYears" />
            </div>
            <div class="form-card">
              <label>Número de Tecnologías</label>
              <input type="number" class="form-input" [(ngModel)]="aboutForm.technologiesCount" />
            </div>
            <div class="form-card">
              <label>Proyectos Completados</label>
              <input type="number" class="form-input" [(ngModel)]="aboutForm.completedProjectsCount" />
            </div>

            <h3 class="form-section-title" style="grid-column:1/-1">🔗 URLs y Contacto</h3>
            <div class="form-card" style="grid-column: 1/-1">
              <label>📄 URL del CV (enlace a PDF)</label>
              <input type="url" class="form-input" [(ngModel)]="aboutForm.cvUrl" placeholder="https://example.com/CV_Steven.pdf" />
            </div>
            <div class="form-card">
              <label>GitHub URL</label>
              <input type="url" class="form-input" [(ngModel)]="aboutForm.githubUrl" />
            </div>
            <div class="form-card">
              <label>LinkedIn URL</label>
              <input type="url" class="form-input" [(ngModel)]="aboutForm.linkedinUrl" />
            </div>
            <div class="form-card">
              <label>Email de Contacto</label>
              <input type="email" class="form-input" [(ngModel)]="aboutForm.email" />
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             5. CONTACT TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'contact'" class="tab-content">
          <div class="content-bar">
            <h2>Mensajes de Contacto ({{ contactMsgs().length }})</h2>
          </div>

          <div class="table-responsive">
            <table class="admin-table" *ngIf="contactMsgs().length > 0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Asunto</th>
                  <th>Mensaje</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let msg of contactMsgs(); let i = index">
                  <td><strong>{{ msg.name }}</strong></td>
                  <td><a [href]="'mailto:' + msg.email" class="link-sm">{{ msg.email }}</a></td>
                  <td>{{ msg.subject }}</td>
                  <td>
                    <button class="btn-text-expand" (click)="openMsgPopup(msg)">{{ msg.message | slice:0:60 }}... <span class="expand-hint">ver más</span></button>
                  </td>
                  <td>
                    <button class="btn-icon delete" (click)="deleteContactMsg(i)" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="no-data" *ngIf="contactMsgs().length === 0">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
              <p>No hay mensajes de contacto aún.</p>
            </div>
          </div>
        </section>

      </div>

      <!-- ═══════════════════════════════════════════════
           PROJECT MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showProjectModal" (click)="showProjectModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto' }}</h3>
          <form (ngSubmit)="saveProject()">
            <div class="form-group">
              <label>Título del Proyecto</label>
              <input type="text" class="form-input" [(ngModel)]="projectForm.title" name="title" required />
            </div>
            <div class="form-group">
              <label>Descripción Corta</label>
              <textarea class="form-input" [(ngModel)]="projectForm.description" name="description" rows="2" required></textarea>
            </div>
            <div class="form-group">
              <label>Descripción Detallada (Para Pop-up)</label>
              <textarea class="form-input" [(ngModel)]="projectForm.longDescription" name="longDescription" rows="4"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select class="form-input" [(ngModel)]="projectForm.category" name="category">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="ai">IA & ML</option>
                  <option value="devops">Cloud & DevOps</option>
                </select>
              </div>
              <div class="form-group">
                <label>Estrellas (Stars ⭐)</label>
                <input type="number" class="form-input" [(ngModel)]="projectForm.stars" name="stars" />
              </div>
            </div>
            <div class="form-group">
              <label>Tecnologías (Separadas por comas)</label>
              <input type="text" class="form-input" [(ngModel)]="techsString" name="techs" placeholder="Angular, C#, Docker, Azure" />
            </div>
            <div class="form-group">
              <label>📷 Imagen 1 URL (Carrusel)</label>
              <input type="url" class="form-input" [(ngModel)]="imgUrl1" name="imgUrl1" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>📷 Imagen 2 URL (Carrusel)</label>
              <input type="url" class="form-input" [(ngModel)]="imgUrl2" name="imgUrl2" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>📷 Imagen 3 URL (Carrusel)</label>
              <input type="url" class="form-input" [(ngModel)]="imgUrl3" name="imgUrl3" placeholder="https://..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>GitHub Code URL</label>
                <input type="url" class="form-input" [(ngModel)]="projectForm.githubUrl" name="githubUrl" />
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="projectForm.featured" name="featured" /> Marcar como Destacado ⭐</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showProjectModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Proyecto</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           BLOG MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showBlogModal" (click)="showBlogModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingBlog ? 'Editar Artículo' : 'Añadir Nuevo Artículo' }}</h3>
          <form (ngSubmit)="saveBlog()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Título del Artículo</label>
                <input type="text" class="form-input" [(ngModel)]="blogForm.title" name="btitle" required />
              </div>
              <div class="form-group flex-1">
                <label>Icono (Emoji)</label>
                <input type="text" class="form-input" [(ngModel)]="blogForm.icon" name="bicon" placeholder="🤖" />
              </div>
            </div>
            <div class="form-group">
              <label>Resumen / Excerpt</label>
              <textarea class="form-input" [(ngModel)]="blogForm.excerpt" name="bexcerpt" rows="2" required></textarea>
            </div>
            <div class="form-group">
              <label>Contenido Completo del Artículo (Para Pop-up)</label>
              <textarea class="form-input" [(ngModel)]="blogForm.content" name="bcontent" rows="6"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select class="form-input" [(ngModel)]="blogForm.category" name="bcategory">
                  <option value="ai">IA & ML</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="product">Producto</option>
                </select>
              </div>
              <div class="form-group">
                <label>Likes ❤️</label>
                <input type="number" class="form-input" [(ngModel)]="blogForm.likes" name="blikes" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input type="text" class="form-input" [(ngModel)]="blogForm.date" name="bdate" placeholder="Agosto 2026" />
              </div>
              <div class="form-group">
                <label>Tiempo Lectura (min)</label>
                <input type="number" class="form-input" [(ngModel)]="blogForm.readTime" name="bread" />
              </div>
            </div>
            <div class="form-group">
              <label>Tags (Separados por comas)</label>
              <input type="text" class="form-input" [(ngModel)]="tagsString" name="btags" placeholder="FastAPI, RAG, Python" />
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="blogForm.featured" name="bfeatured" /> Artículo Destacado ⭐</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showBlogModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Artículo</button>
            </div>
          </form>
        </div>
      </div>

    </main>

    <!-- MESSAGE POPUP MODAL -->
    <div class="modal-backdrop" *ngIf="selectedMsg" (click)="selectedMsg = null">
      <div class="modal-card msg-popup" (click)="$event.stopPropagation()">
        <button class="close-x" (click)="selectedMsg = null">✕</button>
        <div class="msg-popup-header">
          <div class="msg-popup-avatar">{{ selectedMsg.name.charAt(0).toUpperCase() }}</div>
          <div>
            <h3>{{ selectedMsg.name }}</h3>
            <a [href]="'mailto:' + selectedMsg.email" class="link-sm">{{ selectedMsg.email }}</a>
          </div>
        </div>
        <div class="msg-popup-subject">
          <span class="label">Asunto:</span> {{ selectedMsg.subject }}
        </div>
        <div class="msg-popup-body">{{ selectedMsg.message }}</div>
        <div class="msg-popup-footer">
          <a [href]="'mailto:' + selectedMsg.email" class="btn btn-primary">&#128140; Responder por Email</a>
          <button class="btn btn-outline" (click)="selectedMsg = null">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      padding: 6rem 1.5rem 4rem;
      background: #080F1E;
      color: #F8FAFC;
    }

    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .admin-badge {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      color: #60A5FA;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      padding: 0.25rem 0.85rem;
      border-radius: 100px;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 0.4rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA, #C084FC);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: #94A3B8;
      font-size: 0.95rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .admin-tabs {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0.75rem;
    }

    .tab-btn {
      padding: 0.65rem 1.4rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      color: #94A3B8;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
      &.active { color: #60A5FA; background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.3); }
    }

    .content-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      h2 { font-size: 1.35rem; font-weight: 700; margin: 0; }
    }

    .table-responsive {
      overflow-x: auto;
      background: #0F172A;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;

      th, td { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
      th { background: rgba(255, 255, 255, 0.03); color: #94A3B8; font-weight: 600; text-transform: uppercase; font-size: 0.78rem; }
      tr:last-child td { border-bottom: none; }
    }

    .table-sub { font-size: 0.78rem; color: #94A3B8; font-weight: 400; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      font-size: 0.75rem;
      color: #CBD5E1;
    }

    .link-sm { color: #60A5FA; text-decoration: none; &:hover { text-decoration: underline; } }

    .action-btns { display: flex; gap: 0.5rem; }

    .btn-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { background: rgba(255, 255, 255, 0.15); }
      &.delete:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); }
    }

    .metrics-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .form-card {
      background: #0F172A;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label { font-size: 0.85rem; font-weight: 600; color: #CBD5E1; }
    }

    .btn {
      padding: 0.65rem 1.4rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary { background: #3B82F6; color: #fff; &:hover { background: #2563EB; } }
    .btn-outline { background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; &:hover { background: rgba(255, 255, 255, 0.1); } }
    .btn-danger { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #F87171; &:hover { background: #EF4444; color: #fff; } }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-card {
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);

      h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 1.5rem; }
    }

    .form-section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #60A5FA;
      margin: 0.5rem 0;
    }

    .about-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .btn-text-expand {
      background: none;
      border: none;
      color: #CBD5E1;
      font-size: 0.85rem;
      cursor: pointer;
      text-align: left;
      padding: 0;
      &:hover { color: #fff; }
      .expand-hint { color: #3B82F6; font-size: 0.78rem; }
    }

    .msg-popup {
      max-width: 560px;
      padding: 2rem;
    }

    .close-x {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(255,255,255,0.08); border: none; color: #94A3B8;
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;
      &:hover { background: rgba(239,68,68,0.5); color: #fff; }
    }

    .msg-popup-header {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
    }

    .msg-popup-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6, #A78BFA);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; font-weight: 800; color: #fff; flex-shrink: 0;
    }

    .msg-popup-header h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }

    .msg-popup-subject {
      font-size: 0.85rem; color: #94A3B8; margin-bottom: 1rem;
      .label { font-weight: 700; color: #CBD5E1; }
    }

    .msg-popup-body {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 1rem 1.25rem;
      font-size: 0.9rem; color: #E2E8F0; line-height: 1.7;
      white-space: pre-wrap; margin-bottom: 1.5rem;
    }

    .msg-popup-footer { display: flex; gap: 0.75rem; justify-content: flex-end; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      label { font-size: 0.82rem; font-weight: 600; color: #CBD5E1; }
    }

    .form-row { display: flex; gap: 1rem; > div { flex: 1; } }
    .flex-1 { flex: 1; } .flex-2 { flex: 2; }

    .form-input {
      padding: 0.65rem 0.9rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      width: 100%;

      &:focus { outline: none; border-color: #3B82F6; }
    }

    .checkbox-group label { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
  `]
})
export class AdminComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'projects' | 'blogs' | 'metrics' | 'about' | 'contact'>('projects');

  projects = this.portfolioService.projectsSignal;
  blogs = this.portfolioService.blogPostsSignal;
  contactMsgs = this.portfolioService.contactMsgsSignal;

  metricsForm: SiteMetrics = { ...this.portfolioService.getMetrics() };
  aboutForm: AboutInfo = { ...this.portfolioService.getAboutInfo() };

  selectedMsg: ContactMessage | null = null;

  // Project Modal state
  showProjectModal = false;
  editingProject: Project | null = null;
  projectForm: Partial<Project> = {};
  techsString = '';
  imgUrl1 = '';
  imgUrl2 = '';
  imgUrl3 = '';

  // Blog Modal state
  showBlogModal = false;
  editingBlog: BlogPost | null = null;
  blogForm: Partial<BlogPost> = {};
  tagsString = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        const t = params['tab'];
        if (t === 'projects' || t === 'blogs' || t === 'metrics' || t === 'about' || t === 'contact') {
          this.activeTab.set(t);
        } else if (t === 'blog') {
          this.activeTab.set('blogs');
        }
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // --- Project CRUD ---
  openAddProjectModal() {
    this.editingProject = null;
    this.projectForm = {
      title: '',
      description: '',
      longDescription: '',
      category: 'backend',
      stars: 10,
      featured: false,
      liveUrl: 'https://github.com/StevenPiedra-dev',
      githubUrl: 'https://github.com/StevenPiedra-dev',
      imageUrl: 'assets/projects/ecommerce.jpg',
      year: 2026
    };
    this.imgUrl1 = 'assets/projects/ecommerce.jpg';
    this.imgUrl2 = 'assets/projects/taskmanager.jpg';
    this.imgUrl3 = 'assets/projects/weather.jpg';
    this.techsString = 'Angular, C#, .NET Core, SQL Server';
    this.showProjectModal = true;
  }

  openEditProjectModal(project: Project) {
    this.editingProject = project;
    this.projectForm = { ...project };
    this.imgUrl1 = project.images?.[0] || project.imageUrl || '';
    this.imgUrl2 = project.images?.[1] || '';
    this.imgUrl3 = project.images?.[2] || '';
    this.techsString = (project.technologies || []).join(', ');
    this.showProjectModal = true;
  }

  saveProject() {
    const techs = this.techsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const images = [this.imgUrl1, this.imgUrl2, this.imgUrl3]
      .map(u => u ? u.trim() : '')
      .filter(u => u.length > 0);

    if (images.length === 0) {
      images.push(this.projectForm.imageUrl || 'assets/projects/ecommerce.jpg');
    }

    const projData: Omit<Project, 'id'> = {
      title: this.projectForm.title || 'Nuevo Proyecto',
      description: this.projectForm.description || '',
      longDescription: this.projectForm.longDescription || '',
      technologies: techs,
      imageUrl: images[0] || 'assets/projects/ecommerce.jpg',
      images: images,
      liveUrl: this.projectForm.liveUrl,
      githubUrl: this.projectForm.githubUrl,
      featured: !!this.projectForm.featured,
      stars: this.projectForm.stars || 0,
      category: this.projectForm.category || 'backend',
      year: this.projectForm.year || 2026
    };

    if (this.editingProject) {
      this.portfolioService.updateProject({ ...projData, id: this.editingProject.id });
    } else {
      this.portfolioService.addProject(projData);
    }

    this.showProjectModal = false;
  }

  deleteProject(id: number) {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      this.portfolioService.deleteProject(id);
    }
  }

  // --- Blog CRUD ---
  openAddBlogModal() {
    this.editingBlog = null;
    this.blogForm = {
      title: '',
      excerpt: '',
      content: '',
      category: 'ai',
      icon: '🤖',
      likes: 15,
      featured: false,
      date: 'Agosto 2026',
      readTime: 10,
      gradient: 'linear-gradient(135deg, #2a1a5c, #7c3aed)'
    };
    this.tagsString = 'FastAPI, Python, AI';
    this.showBlogModal = true;
  }

  openEditBlogModal(blog: BlogPost) {
    this.editingBlog = blog;
    this.blogForm = { ...blog };
    this.tagsString = (blog.tags || []).join(', ');
    this.showBlogModal = true;
  }

  saveBlog() {
    const tags = this.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const blogData: Omit<BlogPost, 'id'> = {
      title: this.blogForm.title || 'Nuevo Artículo',
      excerpt: this.blogForm.excerpt || '',
      content: this.blogForm.content || '',
      category: this.blogForm.category || 'ai',
      tags: tags,
      readTime: this.blogForm.readTime || 5,
      date: this.blogForm.date || 'Agosto 2026',
      icon: this.blogForm.icon || '📝',
      featured: !!this.blogForm.featured,
      gradient: this.blogForm.gradient || 'linear-gradient(135deg, #1a3a5c, #3B82F6)',
      likes: this.blogForm.likes || 0
    };

    if (this.editingBlog) {
      this.portfolioService.updateBlogPost({ ...blogData, id: this.editingBlog.id });
    } else {
      this.portfolioService.addBlogPost(blogData);
    }

    this.showBlogModal = false;
  }

  deleteBlog(id: number) {
    if (confirm('¿Está seguro de eliminar este artículo?')) {
      this.portfolioService.deleteBlogPost(id);
    }
  }

  // --- Metrics ---
  saveMetrics() {
    this.portfolioService.updateMetrics(this.metricsForm);
    alert('¡Métricas del sitio actualizadas con éxito!');
  }

  // --- About Me ---
  saveAboutInfo() {
    this.portfolioService.updateAboutInfo(this.aboutForm);
    alert('¡Información de About Me guardada con éxito!');
  }

  // --- Contact Messages ---
  openMsgPopup(msg: ContactMessage) {
    this.selectedMsg = msg;
  }

  deleteContactMsg(index: number) {
    if (confirm('¿Eliminar este mensaje de contacto?')) {
      this.portfolioService.deleteContactMessage(index);
      this.selectedMsg = null;
    }
  }
}
