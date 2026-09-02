import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AuthService } from '../../core/services/auth.service';
import { Project, BlogPost, SiteMetrics, AboutInfo, ContactMessage, Skill, TimelineItem, CertificationItem, SkillCategory } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <main class="admin-page">
      <div class="admin-container">
        
        <!-- HEADER -->
        <header class="admin-header">
          <div class="header-left">
            <div class="admin-badge">⚡ Management Console</div>
            <h1>Panel Administrativo <span class="gradient-text">CRUD</span></h1>
            <p class="subtitle">Gestiona proyectos, artículos, habilidades, experiencia y contenidos en tiempo real.</p>
          </div>
          <div class="header-actions">
            <a routerLink="/" class="btn btn-outline">👁️ Ver Sitio Público</a>
            <button class="btn btn-danger" (click)="onLogout()">🔒 Cerrar Sesión</button>
          </div>
        </header>

        <!-- TABS BAR -->
        <div class="admin-tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'projects'" (click)="activeTab.set('projects')">
            🚀 Proyectos ({{ projects().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'blogs'" (click)="activeTab.set('blogs')">
            📝 Blog ({{ blogs().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'about'" (click)="activeTab.set('about')">
            👤 About Me & Stacks
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'metrics'" (click)="activeTab.set('metrics')">
            📊 Métricas Automáticas
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'contact'" (click)="activeTab.set('contact')">
            💬 Mensajes ({{ contactMsgs().length }})
          </button>
        </div>

        <!-- ═══════════════════════════════════════════════
             1. PROJECTS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'projects'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Gestión de Proyectos</h2>
              <p class="section-desc">Crea y edita tus proyectos con carrusel de hasta 3 fotos subidas directamente.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddProjectModal()">+ Añadir Proyecto</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Título & Descripción</th>
                  <th>Categoría</th>
                  <th>Estrellas ⭐</th>
                  <th>Destacado</th>
                  <th>Enlaces</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of projects()">
                  <td>
                    <div class="table-thumb-box">
                      <img [src]="p.imageUrl || (p.images && p.images[0]) || 'assets/projects/ecommerce.jpg'" [alt]="p.title" class="table-thumb" />
                      <span *ngIf="p.images && p.images.length > 1" class="thumb-count">{{ p.images.length }} fotos</span>
                    </div>
                  </td>
                  <td>
                    <strong>{{ p.title }}</strong>
                    <div class="table-sub">{{ p.description | slice:0:70 }}...</div>
                  </td>
                  <td><span class="badge badge-cat">{{ p.category || 'N/A' }}</span></td>
                  <td>⭐ {{ p.stars || 0 }}</td>
                  <td>{{ p.featured ? '⭐ Destacado' : 'Estándar' }}</td>
                  <td>
                    <div class="links-group">
                      <a *ngIf="p.liveUrl" [href]="p.liveUrl" target="_blank" class="link-sm">Demo ↗</a>
                      <a *ngIf="p.githubUrl" [href]="p.githubUrl" target="_blank" class="link-sm">Código ↗</a>
                    </div>
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
            <div>
              <h2>Artículos de Blog</h2>
              <p class="section-desc">Publica artículos con portada personalizada y contenido enriquecido.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddBlogModal()">+ Añadir Artículo</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Portada</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Likes ❤️</th>
                  <th>Destacado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of blogs()">
                  <td>
                    <div class="table-thumb-box">
                      <img *ngIf="b.coverImage" [src]="b.coverImage" [alt]="b.title" class="table-thumb" />
                      <div *ngIf="!b.coverImage" class="table-thumb-placeholder">{{ b.icon || '📝' }}</div>
                    </div>
                  </td>
                  <td>
                    <strong>{{ b.title }}</strong>
                    <div class="table-sub">{{ b.excerpt | slice:0:65 }}...</div>
                  </td>
                  <td><span class="badge badge-cat">{{ b.category }}</span></td>
                  <td>{{ b.date }}</td>
                  <td>❤️ {{ b.likes || 0 }}</td>
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
             3. ABOUT ME & STACKS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'about'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Gestión de Perfil, Habilidades y Trayectoria</h2>
              <p class="section-desc">Actualiza tus fotos, CV, biografía, stacks técnicos, experiencia y educación.</p>
            </div>
            <button class="btn btn-primary" (click)="saveAboutInfo()">💾 Guardar Información</button>
          </div>

          <!-- Section 1: Photo & CV Uploads -->
          <div class="admin-sub-card">
            <h3 class="sub-card-title">📸 Archivos y Documentos</h3>
            <div class="media-upload-row">
              <!-- Profile Photo -->
              <div class="upload-box">
                <label class="upload-label">Foto de Perfil (Hero / About)</label>
                <div class="avatar-preview-box">
                  <img [src]="aboutForm.profilePhoto || 'assets/steven-photo.jpg'" alt="Foto de Perfil" class="preview-avatar-img" />
                  <div class="upload-btn-wrap">
                    <input type="file" id="profile-upload" accept="image/*" (change)="onProfilePhotoUpload($event)" class="file-hidden-input" />
                    <label for="profile-upload" class="btn btn-sm btn-outline">📁 Cambiar Foto</label>
                    <button *ngIf="aboutForm.profilePhoto" type="button" class="btn btn-sm btn-danger" (click)="aboutForm.profilePhoto = ''">Quitar</button>
                  </div>
                </div>
              </div>

              <!-- CV Upload -->
              <div class="upload-box">
                <label class="upload-label">Curriculum Vitae (CV / Resume)</label>
                <div class="cv-preview-box">
                  <div class="cv-file-badge">
                    <span class="file-icon">📄</span>
                    <div class="file-meta">
                      <strong>{{ aboutForm.cvFileName || 'CV_Steven_Piedra.pdf' }}</strong>
                      <span class="file-sub">Documento PDF para descarga pública</span>
                    </div>
                  </div>
                  <div class="upload-btn-wrap">
                    <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" (change)="onCvFileUpload($event)" class="file-hidden-input" />
                    <label for="cv-upload" class="btn btn-sm btn-primary">📤 Subir Nuevo CV</label>
                    <a *ngIf="aboutForm.cvUrl" [href]="aboutForm.cvUrl" target="_blank" [download]="aboutForm.cvFileName || 'CV.pdf'" class="btn btn-sm btn-outline">👁️ Probar Descarga</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Personal Information Form -->
          <div class="admin-sub-card">
            <h3 class="sub-card-title">👤 Datos Personales & Biografía</h3>
            <div class="about-form-grid">
              <div class="form-card">
                <label>Nombre Completo</label>
                <input type="text" class="form-input" [(ngModel)]="aboutForm.fullName" />
              </div>
              <div class="form-card">
                <label>Título Profesional</label>
                <input type="text" class="form-input" [(ngModel)]="aboutForm.roleTitle" placeholder="Full Stack Developer | AI Developer" />
              </div>
              <div class="form-card" style="grid-column: 1/-1;">
                <label>Párrafo Biografía 1</label>
                <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph1" rows="3"></textarea>
              </div>
              <div class="form-card" style="grid-column: 1/-1;">
                <label>Párrafo Biografía 2</label>
                <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph2" rows="3"></textarea>
              </div>
              <div class="form-card">
                <label>Años de Experiencia</label>
                <input type="number" class="form-input" [(ngModel)]="aboutForm.experienceYears" />
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
          </div>

          <!-- Section 3: Technologies / Skills CRUD -->
          <div class="admin-sub-card">
            <div class="sub-card-head">
              <div>
                <h3 class="sub-card-title">🛠️ Stacks Tecnológicos & Competencias ({{ skills().length }})</h3>
                <p class="section-desc">Los gráficos de "Stack Distribution" y "Top Skills" se actualizan automáticamente al editar aquí.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddSkillModal()">+ Añadir Tecnología</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Nivel de Dominio</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of skills(); let i = index">
                    <td><strong>{{ s.name }}</strong></td>
                    <td><span class="badge badge-cat">{{ s.category }}</span></td>
                    <td>
                      <div class="skill-bar-row">
                        <div class="bar-bg"><div class="bar-fill" [style.width.%]="s.level"></div></div>
                        <span class="level-txt">{{ s.level }}%</span>
                      </div>
                    </td>
                    <td><span class="table-sub">{{ s.description || 'Sin descripción' }}</span></td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon edit" (click)="openEditSkillModal(s, i)" title="Editar">✏️</button>
                        <button class="btn-icon delete" (click)="deleteSkill(i)" title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 4: Experience / Timeline CRUD -->
          <div class="admin-sub-card">
            <div class="sub-card-head">
              <div>
                <h3 class="sub-card-title">💼 Experiencia Laboral & Trayectoria ({{ timelineItems.length }})</h3>
                <p class="section-desc">Gestiona tus puestos de trabajo con logos de empresa reales.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddTimelineModal()">+ Añadir Experiencia</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Puesto / Cargo</th>
                    <th>Empresa & Ubicación</th>
                    <th>Periodo</th>
                    <th>Skills / Tags</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of timelineItems; let i = index">
                    <td>
                      <div class="logo-circle">
                        <img *ngIf="item.companyLogo" [src]="item.companyLogo" [alt]="item.company" class="company-logo-preview" />
                        <span *ngIf="!item.companyLogo">{{ item.icon || '💼' }}</span>
                      </div>
                    </td>
                    <td><strong>{{ item.role }}</strong></td>
                    <td>{{ item.company }}</td>
                    <td><span class="badge">{{ item.period }}</span></td>
                    <td>
                      <div class="tags-row">
                        <span *ngFor="let t of item.tags" class="tag-chip-sm">{{ t }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon edit" (click)="openEditTimelineModal(item, i)" title="Editar">✏️</button>
                        <button class="btn-icon delete" (click)="deleteTimeline(i)" title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 5: Education & Certifications CRUD -->
          <div class="admin-sub-card">
            <div class="sub-card-head">
              <div>
                <h3 class="sub-card-title">🎓 Educación & Certificaciones ({{ certItems.length }})</h3>
                <p class="section-desc">Gestiona tus títulos académicos y certificaciones profesionales.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddCertModal()">+ Añadir Título / Certificación</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Ícono / Logo</th>
                    <th>Nombre del Título</th>
                    <th>Institución / Emisor</th>
                    <th>Periodo / Año</th>
                    <th>Estado / Nivel</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of certItems; let i = index">
                    <td><span style="font-size:1.4rem;">{{ c.icon || '🎓' }}</span></td>
                    <td><strong>{{ c.name }}</strong></td>
                    <td>{{ c.issuer }}</td>
                    <td>{{ c.year }}</td>
                    <td><span class="badge" [class.badge-active]="c.level === 'In-Progress'">{{ c.level }}</span></td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon edit" (click)="openEditCertModal(c, i)" title="Editar">✏️</button>
                        <button class="btn-icon delete" (click)="deleteCert(i)" title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ═══════════════════════════════════════════════
             4. METRICS TAB (AUTOMATIC)
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'metrics'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Métricas Calculadas Automáticamente</h2>
              <p class="section-desc">Las estadísticas se generan en tiempo real a partir del estado de tu portafolio y GitHub.</p>
            </div>
          </div>

          <div class="auto-metrics-grid">
            <div class="metric-card-kpi">
              <div class="kpi-icon">🚀</div>
              <div class="kpi-num">{{ projects().length }}</div>
              <div class="kpi-label">Proyectos Registrados</div>
              <div class="kpi-sub">Calculado de la pestaña Proyectos</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">📝</div>
              <div class="kpi-num">{{ blogs().length }}</div>
              <div class="kpi-label">Artículos Publicados</div>
              <div class="kpi-sub">Calculado de la pestaña Blog</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🛠️</div>
              <div class="kpi-num">{{ skills().length }}</div>
              <div class="kpi-label">Tecnologías Dominadas</div>
              <div class="kpi-sub">Calculado de tus habilidades</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🎓</div>
              <div class="kpi-num">{{ certItems.length }}</div>
              <div class="kpi-label">Certificaciones y Grados</div>
              <div class="kpi-sub">Calculado de tus certificaciones</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">💬</div>
              <div class="kpi-num">{{ contactMsgs().length }}</div>
              <div class="kpi-label">Mensajes Recibidos</div>
              <div class="kpi-sub">Formularios de contacto directos</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🐙</div>
              <div class="kpi-num">14+</div>
              <div class="kpi-label">Repositorios GitHub</div>
              <div class="kpi-sub">Sincronizado vía GitHub API</div>
            </div>
          </div>

          <div class="metric-info-banner">
            <div class="info-icon">⚡</div>
            <div>
              <h4>Sincronización Automática Activa</h4>
              <p>No necesitas ingresar valores manualmente. Cada vez que agregas un proyecto, artículo, habilidad o certificación, las métricas del Home y About Me se actualizan automáticamente en vivo.</p>
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             5. CONTACT MESSAGES TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'contact'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Bandeja de Contacto ({{ contactMsgs().length }})</h2>
              <p class="section-desc">Todos los mensajes enviados desde el formulario web se muestran aquí inmediatamente.</p>
            </div>
          </div>

          <div class="table-responsive">
            <table class="admin-table" *ngIf="contactMsgs().length > 0">
              <thead>
                <tr>
                  <th>Remitente</th>
                  <th>Correo Electrónico</th>
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
                    <button class="btn-text-expand" (click)="openMsgPopup(msg)">
                      {{ msg.message | slice:0:70 }}... <span class="expand-hint">ver completo</span>
                    </button>
                  </td>
                  <td>
                    <button class="btn-icon delete" (click)="deleteContactMsg(i)" title="Eliminar mensaje">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="no-data" *ngIf="contactMsgs().length === 0">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
              <p>No hay mensajes en la bandeja de contacto.</p>
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
              <label>Título del Proyecto *</label>
              <input type="text" class="form-input" [(ngModel)]="projectForm.title" name="title" required placeholder="Ej: Sistema Core Bancario" />
            </div>
            <div class="form-group">
              <label>Descripción Corta (Tarjeta) *</label>
              <textarea class="form-input" [(ngModel)]="projectForm.description" name="description" rows="2" required placeholder="Resumen conciso..."></textarea>
            </div>
            <div class="form-group">
              <label>Descripción Detallada (Modal de Detalle)</label>
              <textarea class="form-input" [(ngModel)]="projectForm.longDescription" name="longDescription" rows="4" placeholder="Explicación exhaustiva del stack, arquitectura, etc..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select class="form-input form-select" [(ngModel)]="projectForm.category" name="category">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="ai">IA & Machine Learning</option>
                  <option value="devops">Cloud & DevOps</option>
                </select>
              </div>
              <div class="form-group">
                <label>Año</label>
                <input type="number" class="form-input" [(ngModel)]="projectForm.year" name="year" placeholder="2026" />
              </div>
            </div>
            <div class="form-group">
              <label>Tecnologías (Separadas por comas)</label>
              <input type="text" class="form-input" [(ngModel)]="techsString" name="techs" placeholder="Angular, C#, .NET Core, SQL Server, Docker" />
            </div>

            <!-- Photos Carousel Upload (Up to 3 images) -->
            <div class="form-group">
              <label>📸 Fotos del Carrusel (Hasta 3 imágenes)</label>
              <div class="carousel-uploader-box">
                <div class="thumbnails-preview-row">
                  <div *ngFor="let img of projectImages; let idx = index" class="thumb-preview-item">
                    <img [src]="img" [alt]="'Foto ' + (idx + 1)" />
                    <button type="button" class="btn-remove-thumb" (click)="removeProjectImage(idx)" title="Eliminar foto">✕</button>
                    <span class="thumb-badge">Foto {{ idx + 1 }}</span>
                  </div>
                </div>
                <div class="upload-actions-row" *ngIf="projectImages.length < 3">
                  <input type="file" id="proj-img-input" accept="image/*" (change)="onProjectImageUpload($event)" class="file-hidden-input" />
                  <label for="proj-img-input" class="btn btn-sm btn-outline">+ Subir Foto ({{ projectImages.length }}/3)</label>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Live Demo URL</label>
                <input type="url" class="form-input" [(ngModel)]="projectForm.liveUrl" name="liveUrl" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>GitHub Code URL</label>
                <input type="url" class="form-input" [(ngModel)]="projectForm.githubUrl" name="githubUrl" placeholder="https://github.com/..." />
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="projectForm.featured" name="featured" /> Marcar como Proyecto Destacado ⭐</label>
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
            <div class="form-group">
              <label>Título del Artículo *</label>
              <input type="text" class="form-input" [(ngModel)]="blogForm.title" name="btitle" required placeholder="Título del artículo..." />
            </div>

            <!-- Cover Image Upload -->
            <div class="form-group">
              <label>🖼️ Imagen de Portada del Artículo</label>
              <div class="cover-uploader-box">
                <div *ngIf="blogCoverImage" class="cover-preview-item">
                  <img [src]="blogCoverImage" alt="Portada" />
                  <button type="button" class="btn-remove-thumb" (click)="blogCoverImage = ''" title="Eliminar portada">✕</button>
                </div>
                <div class="upload-btn-wrap">
                  <input type="file" id="blog-cover-input" accept="image/*" (change)="onBlogCoverUpload($event)" class="file-hidden-input" />
                  <label for="blog-cover-input" class="btn btn-sm btn-outline">📁 {{ blogCoverImage ? 'Cambiar Portada' : 'Subir Imagen de Portada' }}</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Resumen / Excerpt *</label>
              <textarea class="form-input" [(ngModel)]="blogForm.excerpt" name="bexcerpt" rows="2" required></textarea>
            </div>
            <div class="form-group">
              <label>Contenido Completo (Párrafos o texto)</label>
              <textarea class="form-input" [(ngModel)]="blogForm.content" name="bcontent" rows="6"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select class="form-input form-select" [(ngModel)]="blogForm.category" name="bcategory">
                  <option value="ai">IA & Machine Learning</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps & Cloud</option>
                  <option value="product">Producto & Gestión</option>
                </select>
              </div>
              <div class="form-group">
                <label>Tiempo de Lectura (min)</label>
                <input type="number" class="form-input" [(ngModel)]="blogForm.readTime" name="bread" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Publicación</label>
                <input type="text" class="form-input" [(ngModel)]="blogForm.date" name="bdate" placeholder="Septiembre 2026" />
              </div>
              <div class="form-group">
                <label>Tags (Separados por comas)</label>
                <input type="text" class="form-input" [(ngModel)]="tagsString" name="btags" placeholder="Angular, AI, Python" />
              </div>
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

      <!-- ═══════════════════════════════════════════════
           SKILL MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showSkillModal" (click)="showSkillModal = false">
        <div class="modal-card modal-sm" (click)="$event.stopPropagation()">
          <h3>{{ editingSkillIndex !== null ? 'Editar Tecnología' : 'Añadir Tecnología' }}</h3>
          <form (ngSubmit)="saveSkill()">
            <div class="form-group">
              <label>Nombre de la Tecnología *</label>
              <input type="text" class="form-input" [(ngModel)]="skillForm.name" name="sname" required placeholder="Ej: Angular, FastAPI, Docker" />
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select class="form-input form-select" [(ngModel)]="skillForm.category" name="scat" required>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="databases">Databases / BI</option>
                <option value="cloud">Cloud & DevOps</option>
                <option value="tools">Tools</option>
                <option value="methodologies">Methodologies</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nivel de Dominio ({{ skillForm.level }}%)</label>
              <input type="range" min="10" max="100" step="5" class="form-range" [(ngModel)]="skillForm.level" name="slevel" />
            </div>
            <div class="form-group">
              <label>Descripción / Conceptos clave</label>
              <input type="text" class="form-input" [(ngModel)]="skillForm.description" name="sdesc" placeholder="RxJS, Signals, microfrontends..." />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showSkillModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Tecnología</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           TIMELINE / EXPERIENCE MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showTimelineModal" (click)="showTimelineModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingTimelineIndex !== null ? 'Editar Experiencia' : 'Añadir Experiencia' }}</h3>
          <form (ngSubmit)="saveTimeline()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Cargo / Rol *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.role" name="trole" required placeholder="Ej: Investigation Analyst I" />
              </div>
              <div class="form-group flex-1">
                <label>Año *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.year" name="tyear" required placeholder="2024" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Empresa / Organización *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.company" name="tcompany" required placeholder="BAC, Freelance..." />
              </div>
              <div class="form-group">
                <label>Periodo (Meses y Años) *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.period" name="tperiod" required placeholder="Oct 2024 - Present" />
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="form-group">
              <label>Logo de la Empresa (Subir imagen o usar URL)</label>
              <div class="logo-uploader-row">
                <div *ngIf="timelineForm.companyLogo" class="logo-preview-box">
                  <img [src]="timelineForm.companyLogo" alt="Logo preview" />
                  <button type="button" class="btn-remove-thumb" (click)="timelineForm.companyLogo = ''">✕</button>
                </div>
                <input type="file" id="time-logo-input" accept="image/*" (change)="onTimelineLogoUpload($event)" class="file-hidden-input" />
                <label for="time-logo-input" class="btn btn-sm btn-outline">📁 Subir Logo</label>
                <input type="text" class="form-input" style="flex:1" [(ngModel)]="timelineForm.companyLogo" name="tlogo" placeholder="O pega URL de imagen..." />
              </div>
            </div>

            <div class="form-group">
              <label>Descripción de Responsabilidades y Logros *</label>
              <textarea class="form-input" [(ngModel)]="timelineForm.description" name="tdesc" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>Skills / Tags (Separados por comas)</label>
              <input type="text" class="form-input" [(ngModel)]="timelineTagsString" name="ttags" placeholder="Data Analysis, Power BI, Python" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showTimelineModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Experiencia</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           CERTIFICATION MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showCertModal" (click)="showCertModal = false">
        <div class="modal-card modal-sm" (click)="$event.stopPropagation()">
          <h3>{{ editingCertIndex !== null ? 'Editar Certificación' : 'Añadir Certificación' }}</h3>
          <form (ngSubmit)="saveCert()">
            <div class="form-group">
              <label>Nombre del Título / Certificación *</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.name" name="cname" required placeholder="Ej: Professional MBA with an emphasis in Management" />
            </div>
            <div class="form-group">
              <label>Institución / Universidad Emisora *</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.issuer" name="cissuer" required placeholder="Universidad de Costa Rica (UCR)" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Periodo / Año</label>
                <input type="text" class="form-input" [(ngModel)]="certForm.year" name="cyear" placeholder="Sep 2025 - Present" />
              </div>
              <div class="form-group">
                <label>Estado / Nivel</label>
                <select class="form-input form-select" [(ngModel)]="certForm.level" name="clevel">
                  <option value="Completed">Completado</option>
                  <option value="In-Progress">En Curso</option>
                  <option value="Specialization">Especialización</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Ícono (Emoji)</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.icon" name="cicon" placeholder="🎓, 📊, 💻" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showCertModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Certificación</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           MESSAGE POPUP MODAL
      ═══════════════════════════════════════════════ -->
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
            <a [href]="'mailto:' + selectedMsg.email + '?subject=Re: ' + selectedMsg.subject" class="btn btn-primary">✉️ Responder por Correo</a>
            <button class="btn btn-outline" (click)="selectedMsg = null">Cerrar</button>
          </div>
        </div>
      </div>

    </main>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: #0B0F19;
      color: #F8FAFC;
      padding: 6rem 1rem 4rem;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
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
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);

      h1 {
        font-size: 1.8rem;
        font-weight: 800;
        margin: 0.2rem 0;
      }

      .subtitle {
        color: #94A3B8;
        font-size: 0.9rem;
        margin: 0;
      }
    }

    .admin-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60A5FA;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* TABS */
    .admin-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tab-btn {
      padding: 0.65rem 1.25rem;
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 0.88rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }

      &.active {
        background: #3B82F6;
        color: #fff;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
      }
    }

    /* CONTENT BARS */
    .content-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;

      h2 { font-size: 1.4rem; font-weight: 700; margin: 0; }
    }

    .section-desc {
      color: #94A3B8;
      font-size: 0.85rem;
      margin: 0.2rem 0 0;
    }

    .admin-sub-card {
      background: #0F172A;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    .sub-card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .sub-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0 0 0.25rem;
    }

    /* MEDIA UPLOADS */
    .media-upload-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .upload-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
    }

    .upload-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #CBD5E1;
      margin-bottom: 0.75rem;
    }

    .avatar-preview-box {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .preview-avatar-img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #3B82F6;
    }

    .cv-preview-box {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .cv-file-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.04);
      padding: 0.6rem 0.9rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);

      .file-icon { font-size: 1.4rem; }
      .file-meta {
        display: flex;
        flex-direction: column;
        strong { font-size: 0.85rem; color: #F8FAFC; }
        .file-sub { font-size: 0.75rem; color: #94A3B8; }
      }
    }

    .file-hidden-input { display: none; }
    .upload-btn-wrap { display: flex; gap: 0.5rem; align-items: center; }

    /* TABLES */
    .table-responsive {
      width: 100%;
      overflow-x: auto;
      background: #0F172A;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;

      th {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: #94A3B8;
        font-weight: 600;
        white-space: nowrap;
      }

      td {
        padding: 0.9rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #E2E8F0;
        vertical-align: middle;
      }

      tr:last-child td { border-bottom: none; }
      tr:hover td { background: rgba(255, 255, 255, 0.02); }
    }

    .table-thumb-box {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      background: #1E293B;
    }

    .table-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .table-thumb-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }

    .thumb-count {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      font-size: 0.65rem;
      padding: 1px 3px;
      border-radius: 4px 0 0 0;
      color: #38BDF8;
    }

    .table-sub {
      color: #94A3B8;
      font-size: 0.78rem;
      margin-top: 0.2rem;
    }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #CBD5E1;
    }

    .badge-cat {
      background: rgba(59, 130, 246, 0.15);
      color: #60A5FA;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .badge-active {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .links-group {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .link-sm {
      color: #60A5FA;
      text-decoration: none;
      font-size: 0.8rem;
      &:hover { text-decoration: underline; }
    }

    .action-btns {
      display: flex;
      gap: 0.4rem;
    }

    .btn-icon {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;

      &.edit:hover { background: rgba(59, 130, 246, 0.3); border-color: #3B82F6; }
      &.delete:hover { background: rgba(239, 68, 68, 0.3); border-color: #EF4444; }
    }

    .skill-bar-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-width: 140px;

      .bar-bg {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #3B82F6, #60A5FA);
        border-radius: 4px;
      }
      .level-txt { font-size: 0.78rem; font-weight: 700; color: #94A3B8; }
    }

    .logo-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .company-logo-preview { width: 100%; height: 100%; object-fit: cover; }
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .tag-chip-sm {
      font-size: 0.72rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      color: #94A3B8;
    }

    /* AUTOMATIC METRICS GRID */
    .auto-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .metric-card-kpi {
      background: #0F172A;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.4rem;
      transition: transform 0.2s, border-color 0.2s;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(59, 130, 246, 0.4);
      }

      .kpi-icon { font-size: 2.2rem; }
      .kpi-num { font-size: 2rem; font-weight: 800; color: #F8FAFC; line-height: 1; }
      .kpi-label { font-size: 0.9rem; font-weight: 700; color: #60A5FA; }
      .kpi-sub { font-size: 0.75rem; color: #94A3B8; }
    }

    .metric-info-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: 12px;
      padding: 1.25rem;

      .info-icon { font-size: 2rem; flex-shrink: 0; }
      h4 { margin: 0 0 0.2rem; font-size: 1rem; color: #60A5FA; }
      p { margin: 0; font-size: 0.85rem; color: #CBD5E1; line-height: 1.5; }
    }

    /* ABOUT ME FORM GRID */
    .about-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }

    .form-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label { font-size: 0.8rem; font-weight: 600; color: #CBD5E1; }
    }

    /* BUTTONS */
    .btn {
      padding: 0.65rem 1.3rem;
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

    .btn-sm {
      padding: 0.45rem 0.9rem;
      font-size: 0.8rem;
      border-radius: 8px;
    }

    .btn-primary { background: #3B82F6; color: #fff; &:hover { background: #2563EB; } }
    .btn-outline { background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; &:hover { background: rgba(255, 255, 255, 0.1); } }
    .btn-danger { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #F87171; &:hover { background: #EF4444; color: #fff; } }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-card {
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);

      &.modal-sm { max-width: 480px; }
      h3 { font-size: 1.3rem; font-weight: 800; margin: 0 0 1.25rem; color: #F8FAFC; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.1rem;
      label { font-size: 0.82rem; font-weight: 600; color: #CBD5E1; }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      > div { flex: 1; min-width: 200px; }
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    /* INPUTS & SELECTS FIXES */
    .form-input {
      padding: 0.65rem 0.9rem;
      background: #1E293B;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #F8FAFC;
      font-size: 0.9rem;
      width: 100%;
      box-sizing: border-box;

      &:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
    }

    select.form-input, select.form-select {
      background: #1E293B;
      color: #F8FAFC;
      cursor: pointer;

      option {
        background: #0F172A;
        color: #F8FAFC;
        padding: 0.5rem;
      }
    }

    .form-range {
      width: 100%;
      accent-color: #3B82F6;
      cursor: pointer;
    }

    /* CAROUSEL & COVER UPLOADERS */
    .carousel-uploader-box, .cover-uploader-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .thumbnails-preview-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .thumb-preview-item, .cover-preview-item {
      position: relative;
      width: 100px;
      height: 70px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(59, 130, 246, 0.4);

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .cover-preview-item {
      width: 100%;
      height: 140px;
    }

    .btn-remove-thumb {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.85);
      border: none;
      color: #fff;
      font-size: 0.7rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { background: #EF4444; }
    }

    .thumb-badge {
      position: absolute;
      bottom: 2px;
      left: 2px;
      background: rgba(0, 0, 0, 0.7);
      font-size: 0.65rem;
      padding: 1px 4px;
      border-radius: 4px;
      color: #38BDF8;
    }

    .logo-uploader-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .logo-preview-box {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #3B82F6;

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      font-size: 0.88rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    /* MESSAGE POPUP */
    .msg-popup {
      max-width: 540px;
      padding: 1.75rem;
      position: relative;
    }

    .close-x {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #94A3B8;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.9rem;
      &:hover { background: rgba(239, 68, 68, 0.5); color: #fff; }
    }

    .msg-popup-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .msg-popup-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6, #A78BFA);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      font-weight: 800;
      color: #fff;
    }

    .msg-popup-subject {
      font-size: 0.85rem;
      color: #94A3B8;
      margin-bottom: 1rem;
      .label { font-weight: 700; color: #CBD5E1; }
    }

    .msg-popup-body {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 1rem;
      font-size: 0.9rem;
      color: #E2E8F0;
      line-height: 1.7;
      white-space: pre-wrap;
      margin-bottom: 1.25rem;
    }

    .msg-popup-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
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

    .no-data {
      text-align: center;
      padding: 3rem 1rem;
      color: #94A3B8;
    }

    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .admin-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'projects' | 'blogs' | 'about' | 'metrics' | 'contact'>('projects');

  projects = this.portfolioService.projectsSignal;
  blogs = this.portfolioService.blogPostsSignal;
  skills = this.portfolioService.skillsSignal;
  contactMsgs = this.portfolioService.contactMsgsSignal;
  aboutInfo = this.portfolioService.aboutInfoSignal;

  aboutForm: AboutInfo = { ...this.portfolioService.getAboutInfo() };
  selectedMsg: ContactMessage | null = null;

  // Project Modal state
  showProjectModal = false;
  editingProject: Project | null = null;
  projectForm: Partial<Project> = {};
  techsString = '';
  projectImages: string[] = [];

  // Blog Modal state
  showBlogModal = false;
  editingBlog: BlogPost | null = null;
  blogForm: Partial<BlogPost> = {};
  tagsString = '';
  blogCoverImage = '';

  // Skill Modal state
  showSkillModal = false;
  editingSkillIndex: number | null = null;
  skillForm: Skill = { name: '', level: 80, category: 'frontend', description: '' };

  // Timeline / Experience state
  showTimelineModal = false;
  editingTimelineIndex: number | null = null;
  timelineForm: TimelineItem = { year: '2026', period: '', role: '', company: '', description: '', tags: [], icon: '💼', type: 'work' };
  timelineTagsString = '';

  // Certification Modal state
  showCertModal = false;
  editingCertIndex: number | null = null;
  certForm: CertificationItem = { name: '', issuer: '', year: '', level: 'Completed', icon: '🎓' };

  get timelineItems(): TimelineItem[] {
    return this.aboutForm.timeline || [];
  }

  get certItems(): CertificationItem[] {
    return this.aboutForm.certifications || [];
  }

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

    // Refresh about form with current state
    this.aboutForm = { ...this.portfolioService.getAboutInfo() };
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // --- Project CRUD & Uploads ---
  openAddProjectModal() {
    this.editingProject = null;
    this.projectForm = {
      title: '',
      description: '',
      longDescription: '',
      category: 'backend',
      featured: false,
      liveUrl: '',
      githubUrl: 'https://github.com/StevenPiedra-dev',
      year: 2026
    };
    this.projectImages = ['assets/projects/ecommerce.jpg'];
    this.techsString = 'Angular, C#, .NET Core, SQL Server';
    this.showProjectModal = true;
  }

  openEditProjectModal(project: Project) {
    this.editingProject = project;
    this.projectForm = { ...project };
    this.projectImages = (project.images && project.images.length > 0)
      ? [...project.images]
      : [project.imageUrl || 'assets/projects/ecommerce.jpg'];
    this.techsString = (project.technologies || []).join(', ');
    this.showProjectModal = true;
  }

  onProjectImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && this.projectImages.length < 3) {
          this.projectImages.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeProjectImage(index: number) {
    this.projectImages.splice(index, 1);
  }

  saveProject() {
    const techs = this.techsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const finalImages = this.projectImages.length > 0 ? this.projectImages : ['assets/projects/ecommerce.jpg'];

    const projData: Omit<Project, 'id'> = {
      title: this.projectForm.title || 'Nuevo Proyecto',
      description: this.projectForm.description || '',
      longDescription: this.projectForm.longDescription || '',
      technologies: techs,
      imageUrl: finalImages[0],
      images: finalImages,
      liveUrl: this.projectForm.liveUrl,
      githubUrl: this.projectForm.githubUrl,
      featured: !!this.projectForm.featured,
      stars: this.editingProject ? (this.editingProject.stars || 0) : 0,
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
    if (confirm('¿Está seguro de eliminar este proyecto y sus fotos?')) {
      this.portfolioService.deleteProject(id);
    }
  }

  // --- Blog CRUD & Cover Upload ---
  openAddBlogModal() {
    this.editingBlog = null;
    this.blogForm = {
      title: '',
      excerpt: '',
      content: '',
      category: 'ai',
      icon: '🤖',
      featured: false,
      date: 'Septiembre 2026',
      readTime: 5,
      gradient: 'linear-gradient(135deg, #2a1a5c, #7c3aed)'
    };
    this.blogCoverImage = '';
    this.tagsString = 'FastAPI, Python, AI';
    this.showBlogModal = true;
  }

  openEditBlogModal(blog: BlogPost) {
    this.editingBlog = blog;
    this.blogForm = { ...blog };
    this.blogCoverImage = blog.coverImage || '';
    this.tagsString = (blog.tags || []).join(', ');
    this.showBlogModal = true;
  }

  onBlogCoverUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.blogCoverImage = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
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
      date: this.blogForm.date || 'Septiembre 2026',
      icon: this.blogForm.icon || '📝',
      coverImage: this.blogCoverImage || undefined,
      featured: !!this.blogForm.featured,
      gradient: this.blogForm.gradient || 'linear-gradient(135deg, #1a3a5c, #3B82F6)',
      likes: this.editingBlog ? (this.editingBlog.likes || 0) : 0
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

  // --- Profile & CV Uploads ---
  onProfilePhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.aboutForm.profilePhoto = e.target.result as string;
          this.saveAboutInfo(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onCvFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.aboutForm.cvUrl = e.target.result as string;
          this.aboutForm.cvFileName = fileName;
          this.saveAboutInfo(false);
          alert(`¡CV "${fileName}" cargado con éxito!`);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveAboutInfo(notify = true) {
    this.aboutForm.technologiesCount = this.skills().length;
    this.aboutForm.completedProjectsCount = this.projects().length;
    this.portfolioService.updateAboutInfo(this.aboutForm);
    if (notify) {
      alert('¡Información de About Me guardada con éxito!');
    }
  }

  // --- Skills CRUD ---
  openAddSkillModal() {
    this.editingSkillIndex = null;
    this.skillForm = { name: '', level: 80, category: 'frontend', description: '' };
    this.showSkillModal = true;
  }

  openEditSkillModal(skill: Skill, index: number) {
    this.editingSkillIndex = index;
    this.skillForm = { ...skill };
    this.showSkillModal = true;
  }

  saveSkill() {
    if (!this.skillForm.name.trim()) return;
    if (this.editingSkillIndex !== null) {
      this.portfolioService.updateSkill(this.editingSkillIndex, { ...this.skillForm });
    } else {
      this.portfolioService.addSkill({ ...this.skillForm });
    }
    this.showSkillModal = false;
  }

  deleteSkill(index: number) {
    if (confirm('¿Eliminar esta tecnología?')) {
      this.portfolioService.deleteSkill(index);
    }
  }

  // --- Timeline / Experience CRUD ---
  openAddTimelineModal() {
    this.editingTimelineIndex = null;
    this.timelineForm = {
      year: '2026',
      period: 'Jan 2026 - Present',
      role: '',
      company: '',
      description: '',
      tags: [],
      icon: '💼',
      type: 'work'
    };
    this.timelineTagsString = '';
    this.showTimelineModal = true;
  }

  openEditTimelineModal(item: TimelineItem, index: number) {
    this.editingTimelineIndex = index;
    this.timelineForm = { ...item };
    this.timelineTagsString = (item.tags || []).join(', ');
    this.showTimelineModal = true;
  }

  onTimelineLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.timelineForm.companyLogo = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveTimeline() {
    const tags = this.timelineTagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const itemData: TimelineItem = { ...this.timelineForm, tags };
    const currentTimeline = [...(this.aboutForm.timeline || [])];

    if (this.editingTimelineIndex !== null) {
      currentTimeline[this.editingTimelineIndex] = itemData;
    } else {
      currentTimeline.unshift(itemData);
    }

    this.aboutForm.timeline = currentTimeline;
    this.saveAboutInfo(false);
    this.showTimelineModal = false;
  }

  deleteTimeline(index: number) {
    if (confirm('¿Eliminar esta experiencia?')) {
      const current = [...(this.aboutForm.timeline || [])];
      current.splice(index, 1);
      this.aboutForm.timeline = current;
      this.saveAboutInfo(false);
    }
  }

  // --- Certifications CRUD ---
  openAddCertModal() {
    this.editingCertIndex = null;
    this.certForm = { name: '', issuer: '', year: '2026', level: 'Completed', icon: '🎓' };
    this.showCertModal = true;
  }

  openEditCertModal(cert: CertificationItem, index: number) {
    this.editingCertIndex = index;
    this.certForm = { ...cert };
    this.showCertModal = true;
  }

  saveCert() {
    if (!this.certForm.name.trim()) return;
    const currentCerts = [...(this.aboutForm.certifications || [])];
    if (this.editingCertIndex !== null) {
      currentCerts[this.editingCertIndex] = { ...this.certForm };
    } else {
      currentCerts.unshift({ ...this.certForm });
    }
    this.aboutForm.certifications = currentCerts;
    this.saveAboutInfo(false);
    this.showCertModal = false;
  }

  deleteCert(index: number) {
    if (confirm('¿Eliminar esta certificación?')) {
      const current = [...(this.aboutForm.certifications || [])];
      current.splice(index, 1);
      this.aboutForm.certifications = current;
      this.saveAboutInfo(false);
    }
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
