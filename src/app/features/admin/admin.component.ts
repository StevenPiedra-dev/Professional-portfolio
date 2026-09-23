import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { CloudSyncService } from '../../core/services/cloud-sync.service';
import { AuthService } from '../../core/services/auth.service';
import { Project, BlogPost, SiteMetrics, AboutInfo, ContactMessage, Skill, TimelineItem, CertificationItem, SkillCategory, TechnicalDoc, ContactLinkItem } from '../../core/models/portfolio.models';

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
            <h1>Admin Dashboard <span class="gradient-text">CRUD</span></h1>
            <p class="subtitle">Manage projects, blog posts, skills, experience, and content in real-time.</p>
            <!-- Cloud Sync Status -->
            <div class="sync-status-bar">
              <div class="sync-dot" [ngClass]="cloudSync.syncStatus()">
                <span *ngIf="cloudSync.syncStatus() === 'syncing'" class="sync-spinner"></span>
              </div>
              <span class="sync-label">
                <ng-container [ngSwitch]="cloudSync.syncStatus()">
                  <span *ngSwitchCase="'synced'">☁️ Cloud Synced</span>
                  <span *ngSwitchCase="'syncing'">🔄 Syncing...</span>
                  <span *ngSwitchCase="'offline'">📴 Offline (Saved locally)</span>
                  <span *ngSwitchCase="'error'">⚠️ Sync error</span>
                </ng-container>
              </span>
              <button class="btn-sync-now" (click)="forceSyncNow()" title="Force Sync">
                🔁 Sync Now
              </button>
            </div>
          </div>
          <div class="header-actions">
            <a routerLink="/" class="btn btn-outline">👁️ View Public Site</a>
            <button class="btn btn-danger" (click)="onLogout()">🔒 Sign Out</button>
          </div>
        </header>

        <!-- TABS BAR -->
        <div class="admin-tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'projects'" (click)="activeTab.set('projects')">
            🚀 Projects ({{ projects().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'blogs'" (click)="activeTab.set('blogs')">
            📝 Blog ({{ blogs().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'about'" (click)="activeTab.set('about')">
            👤 About Me & Stacks
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'metrics'" (click)="activeTab.set('metrics')">
            📊 Automated Metrics
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'contact'" (click)="activeTab.set('contact')">
            💬 Messages ({{ contactMsgs().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'contactlinks'" (click)="activeTab.set('contactlinks')">
            🔗 Contact Channels ({{ contactLinks().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'docs'" (click)="activeTab.set('docs')">
            📚 Technical Documentation ({{ technicalDocs().length }})
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'cloudsync'" (click)="activeTab.set('cloudsync')">
            ☁️ Cloud Sync
          </button>
        </div>

        <!-- ═══════════════════════════════════════════════
             1. PROJECTS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'projects'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Project Management</h2>
              <p class="section-desc">Create and edit projects with carousel uploads of up to 3 photos directly.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddProjectModal()">+ Add Project</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Stars ⭐</th>
                  <th>Featured</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of projects()">
                  <td>
                    <div class="table-thumb-box">
                      <img [src]="p.imageUrl || (p.images && p.images[0]) || 'assets/projects/ecommerce.jpg'" [alt]="p.title" class="table-thumb" />
                      <span *ngIf="p.images && p.images.length > 1" class="thumb-count">{{ p.images.length }} photos</span>
                    </div>
                  </td>
                  <td>
                    <strong>{{ p.title }}</strong>
                    <div class="table-sub">{{ p.description | slice:0:70 }}...</div>
                  </td>
                  <td><span class="badge badge-cat">{{ p.category || 'N/A' }}</span></td>
                  <td>⭐ {{ p.stars || 0 }}</td>
                  <td>{{ p.featured ? '⭐ Featured' : 'Standard' }}</td>
                  <td>
                    <div class="links-group">
                      <a *ngIf="p.liveUrl" [href]="p.liveUrl" target="_blank" class="link-sm">Demo ↗</a>
                      <a *ngIf="p.githubUrl" [href]="p.githubUrl" target="_blank" class="link-sm">Code ↗</a>
                    </div>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-icon edit" (click)="openEditProjectModal(p)" title="Edit">✏️</button>
                      <button class="btn-icon delete" (click)="deleteProject(p.id)" title="Delete">🗑️</button>
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
              <h2>Blog Articles</h2>
              <p class="section-desc">Publish articles with custom cover image and rich content.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddBlogModal()">+ Add Article</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Likes ❤️</th>
                  <th>Featured</th>
                  <th>Actions</th>
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
                  <td>{{ b.featured ? '⭐ Yes' : 'No' }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-icon edit" (click)="openEditBlogModal(b)" title="Edit">✏️</button>
                      <button class="btn-icon delete" (click)="deleteBlog(b.id)" title="Delete">🗑️</button>
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
              <h2>Profile, Skills & Career Management</h2>
              <p class="section-desc">Update your photos, CV, biography, technical stacks, experience, and education.</p>
            </div>
            <button class="btn btn-primary" (click)="saveAboutInfo()">💾 Save Information</button>
          </div>

          <!-- Section 1: Photo & CV Uploads -->
          <div class="admin-sub-card">
            <h3 class="sub-card-title">📸 Files and Documents</h3>
            <div class="media-upload-row">
              <!-- Profile Photo -->
              <div class="upload-box">
                <label class="upload-label">Profile Photo (Hero / About)</label>
                <div class="avatar-preview-box">
                  <img [src]="aboutForm.profilePhoto || 'assets/steven-photo.jpg'" alt="Profile Photo" class="preview-avatar-img" />
                  <div class="upload-btn-wrap">
                    <input type="file" id="profile-upload" accept="image/*" (change)="onProfilePhotoUpload($event)" class="file-hidden-input" />
                    <label for="profile-upload" class="btn btn-sm btn-outline">📁 Change Photo</label>
                    <button *ngIf="aboutForm.profilePhoto" type="button" class="btn btn-sm btn-danger" (click)="aboutForm.profilePhoto = ''">Remove</button>
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
                      <strong>{{ aboutForm.cvFileName || 'Steven_Piedra_CV.pdf' }}</strong>
                      <span class="file-sub">PDF document for public download</span>
                    </div>
                  </div>
                  <div class="upload-btn-wrap">
                    <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" (change)="onCvFileUpload($event)" class="file-hidden-input" />
                    <label for="cv-upload" class="btn btn-sm btn-primary">📤 Upload New CV</label>
                    <a *ngIf="aboutForm.cvUrl" [href]="aboutForm.cvUrl" target="_blank" [download]="aboutForm.cvFileName || 'CV.pdf'" class="btn btn-sm btn-outline">👁️ Test Download</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Personal Information Form -->
          <div class="admin-sub-card">
            <h3 class="sub-card-title">👤 Personal Details & Biography</h3>
            <div class="about-form-grid">
              <div class="form-card">
                <label>Full Name</label>
                <input type="text" class="form-input" [(ngModel)]="aboutForm.fullName" />
              </div>
              <div class="form-card">
                <label>Professional Title</label>
                <input type="text" class="form-input" [(ngModel)]="aboutForm.roleTitle" placeholder="Full Stack Developer | AI Developer" />
              </div>
              <div class="form-card" style="grid-column: 1/-1;">
                <label>Biography Paragraph 1</label>
                <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph1" rows="3"></textarea>
              </div>
              <div class="form-card" style="grid-column: 1/-1;">
                <label>Biography Paragraph 2</label>
                <textarea class="form-input" [(ngModel)]="aboutForm.bioParagraph2" rows="3"></textarea>
              </div>
              <div class="form-card">
                <label>Years of Experience</label>
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
                <label>Contact Email</label>
                <input type="email" class="form-input" [(ngModel)]="aboutForm.email" />
              </div>
            </div>
          </div>

          <!-- Section 3: Technologies / Skills CRUD -->
          <div class="admin-sub-card">
            <div class="sub-card-head">
              <div>
                <h3 class="sub-card-title">🛠️ Tech Stacks & Competencies ({{ skills().length }})</h3>
                <p class="section-desc">The "Stack Distribution" and "Top Skills" charts update automatically when edited here.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddSkillModal()">+ Add Technology</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Proficiency Level</th>
                    <th>Description</th>
                    <th>Actions</th>
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
                    <td><span class="table-sub">{{ s.description || 'No description' }}</span></td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon edit" (click)="openEditSkillModal(s, i)" title="Edit">✏️</button>
                        <button class="btn-icon delete" (click)="deleteSkill(i)" title="Delete">🗑️</button>
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
                <h3 class="sub-card-title">💼 Work Experience & Timeline ({{ timelineItems.length }})</h3>
                <p class="section-desc">Manage job positions with actual company logos.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddTimelineModal()">+ Add Experience</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Role / Position</th>
                    <th>Company & Location</th>
                    <th>Period</th>
                    <th>Skills / Tags</th>
                    <th>Actions</th>
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
                        <button class="btn-icon edit" (click)="openEditTimelineModal(item, i)" title="Edit">✏️</button>
                        <button class="btn-icon delete" (click)="deleteTimeline(i)" title="Delete">🗑️</button>
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
                <h3 class="sub-card-title">🎓 Education & Certifications ({{ certItems.length }})</h3>
                <p class="section-desc">Manage your academic degrees and professional certifications.</p>
              </div>
              <button class="btn btn-sm btn-primary" (click)="openAddCertModal()">+ Add Degree / Certification</button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Icon / Logo</th>
                    <th>Degree / Certification Name</th>
                    <th>Institution / Issuer</th>
                    <th>Period / Year</th>
                    <th>Status / Level</th>
                    <th>Actions</th>
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
                        <button class="btn-icon edit" (click)="openEditCertModal(c, i)" title="Edit">✏️</button>
                        <button class="btn-icon delete" (click)="deleteCert(i)" title="Delete">🗑️</button>
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
              <h2>Automatically Calculated Metrics</h2>
              <p class="section-desc">Statistics are generated in real-time based on your portfolio content and GitHub.</p>
            </div>
          </div>

          <div class="auto-metrics-grid">
            <div class="metric-card-kpi">
              <div class="kpi-icon">🚀</div>
              <div class="kpi-num">{{ projects().length }}</div>
              <div class="kpi-label">Projects Registered</div>
              <div class="kpi-sub">Calculated from Projects tab</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">📝</div>
              <div class="kpi-num">{{ blogs().length }}</div>
              <div class="kpi-label">Articles Published</div>
              <div class="kpi-sub">Calculated from Blog tab</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🛠️</div>
              <div class="kpi-num">{{ skills().length }}</div>
              <div class="kpi-label">Mastered Technologies</div>
              <div class="kpi-sub">Calculated from your skills</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🎓</div>
              <div class="kpi-num">{{ certItems.length }}</div>
              <div class="kpi-label">Certifications & Degrees</div>
              <div class="kpi-sub">Calculated from your certifications</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">💬</div>
              <div class="kpi-num">{{ contactMsgs().length }}</div>
              <div class="kpi-label">Messages Received</div>
              <div class="kpi-sub">Direct contact forms</div>
            </div>

            <div class="metric-card-kpi">
              <div class="kpi-icon">🐙</div>
              <div class="kpi-num">14+</div>
              <div class="kpi-label">GitHub Repositories</div>
              <div class="kpi-sub">Synced via GitHub API</div>
            </div>
          </div>

          <div class="metric-info-banner">
            <div class="info-icon">⚡</div>
            <div>
              <h4>Active Automatic Synchronization</h4>
              <p>No manual entry required. Whenever you add a project, article, skill, or certification, the metrics on Home and About Me update automatically in live preview.</p>
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             5. CONTACT MESSAGES TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'contact'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>Contact Inbox ({{ contactMsgs().length }})</h2>
              <p class="section-desc">All messages submitted via the web contact form are displayed here immediately.</p>
            </div>
          </div>

          <div class="table-responsive">
            <table class="admin-table" *ngIf="contactMsgs().length > 0">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email Address</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let msg of contactMsgs(); let i = index">
                  <td><strong>{{ msg.name }}</strong></td>
                  <td><a [href]="'mailto:' + msg.email" class="link-sm">{{ msg.email }}</a></td>
                  <td>{{ msg.subject }}</td>
                  <td>
                    <button class="btn-text-expand" (click)="openMsgPopup(msg)">
                      {{ msg.message | slice:0:70 }}... <span class="expand-hint">view full</span>
                    </button>
                  </td>
                  <td>
                    <button class="btn-icon delete" (click)="deleteContactMsg(i)" title="Delete message">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="no-data" *ngIf="contactMsgs().length === 0">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
              <p>No messages in the contact inbox.</p>
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             6. CONTACT CHANNELS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'contactlinks'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>🔗 Contact Channels</h2>
              <p class="section-desc">Manage all channels: email, LinkedIn, GitHub, WhatsApp, Location, etc. Any change reflects across the entire site immediately.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddLinkModal()">+ Add Channel</button>
          </div>

          <!-- Quick Email Update Banner -->
          <div class="quick-email-banner">
            <div class="quick-email-info">
              <span class="q-email-icon">✉️</span>
              <div>
                <strong>Global Email Update</strong>
                <p>Changing the email here automatically updates About, Footer, Contact Modal, and all contact cards.</p>
              </div>
            </div>
            <div class="quick-email-action">
              <input type="email" class="form-input" [(ngModel)]="aboutForm.email" name="quickemail" placeholder="yourname@gmail.com" />
              <button class="btn btn-primary" (click)="updateEmailEverywhere()">💾 Update Global Email</button>
            </div>
          </div>

          <div class="links-grid">
            <div *ngFor="let link of contactLinks()" class="link-card">
              <div class="link-card-icon">
                <span *ngIf="link.icon === 'email'">✉️</span>
                <span *ngIf="link.icon === 'linkedin'">💼</span>
                <span *ngIf="link.icon === 'github'">🐙</span>
                <span *ngIf="link.icon === 'whatsapp'">📱</span>
                <span *ngIf="link.icon === 'location'">📍</span>
                <span *ngIf="link.icon !== 'email' && link.icon !== 'linkedin' && link.icon !== 'github' && link.icon !== 'whatsapp' && link.icon !== 'location'">🔗</span>
              </div>
              <div class="link-card-info">
                <div class="link-card-title">{{ link.title }}<span class="badge badge-primary" *ngIf="link.isPrimary">Primary</span></div>
                <div class="link-card-sub">{{ link.subtitle }}</div>
                <a [href]="link.url" target="_blank" class="link-card-url">{{ link.url | slice:0:50 }}...</a>
              </div>
              <div class="link-card-actions">
                <button class="btn-icon edit" (click)="openEditLinkModal(link)" title="Edit">✏️</button>
                <button class="btn-icon delete" (click)="deleteLink(link.id)" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             7. TECHNICAL DOCS TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'docs'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>📚 Technical Documentation</h2>
              <p class="section-desc">Manage technical documents displayed in the portfolio Contact section.</p>
            </div>
            <button class="btn btn-primary" (click)="openAddDocModal()">+ Add Document</button>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Title &amp; Summary</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Read Time</th>
                  <th>Updated</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of technicalDocs()">
                  <td class="icon-cell">{{ doc.icon || '📄' }}</td>
                  <td>
                    <strong>{{ doc.title }}</strong>
                    <div class="table-sub">{{ doc.summary | slice:0:80 }}...</div>
                  </td>
                  <td><span class="badge badge-cat">{{ doc.category }}</span></td>
                  <td>
                    <div class="tag-mini-list">
                      <span *ngFor="let tag of (doc.tags || []).slice(0,3)" class="tag-mini">#{{ tag }}</span>
                    </div>
                  </td>
                  <td>{{ doc.estimatedReadTime }}</td>
                  <td>{{ doc.lastUpdated }}</td>
                  <td>{{ doc.isFeatured ? '⭐ Yes' : '—' }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-icon edit" (click)="openEditDocModal(doc)" title="Edit">✏️</button>
                      <button class="btn-icon delete" (click)="deleteDoc(doc.id)" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════
             8. CLOUD SYNC TAB
        ═══════════════════════════════════════════════ -->
        <section *ngIf="activeTab() === 'cloudsync'" class="tab-content">
          <div class="content-bar">
            <div>
              <h2>☁️ Multi-Device Synchronization</h2>
              <p class="section-desc">All changes made here are saved to the cloud and synchronized across all devices in real-time.</p>
            </div>
          </div>

          <!-- Cloud Status Cards -->
          <div class="cloud-status-grid">
            <div class="cloud-stat-card" [ngClass]="'status-' + cloudSync.syncStatus()">
              <div class="cloud-stat-icon">
                <span *ngIf="cloudSync.syncStatus() === 'synced'">☁️</span>
                <span *ngIf="cloudSync.syncStatus() === 'syncing'">🔄</span>
                <span *ngIf="cloudSync.syncStatus() === 'offline'">📴</span>
                <span *ngIf="cloudSync.syncStatus() === 'error'">⚠️</span>
              </div>
              <div class="cloud-stat-info">
                <div class="cloud-stat-label">Cloud Status</div>
                <div class="cloud-stat-value">
                  <span *ngIf="cloudSync.syncStatus() === 'synced'">✅ Synced</span>
                  <span *ngIf="cloudSync.syncStatus() === 'syncing'">🔄 Syncing data...</span>
                  <span *ngIf="cloudSync.syncStatus() === 'offline'">📴 Offline — Saved Locally</span>
                  <span *ngIf="cloudSync.syncStatus() === 'error'">⚠️ Connection Error</span>
                </div>
                <div class="cloud-stat-sub" *ngIf="cloudSync.lastSyncTime()">
                  Last sync: {{ cloudSync.lastSyncTime() | date:'dd/MM/yyyy HH:mm:ss' }}
                </div>
              </div>
            </div>

            <div class="cloud-stat-card">
              <div class="cloud-stat-icon">🔁</div>
              <div class="cloud-stat-info">
                <div class="cloud-stat-label">Auto Sync</div>
                <div class="cloud-stat-value">{{ cloudSync.isAutoSyncEnabled() ? 'Enabled ✅' : 'Disabled ⏸️' }}</div>
                <div class="cloud-stat-sub">Synchronizes automatically on every change</div>
              </div>
              <button class="btn btn-sm btn-outline" (click)="toggleAutoSync()">
                {{ cloudSync.isAutoSyncEnabled() ? 'Disable' : 'Enable' }}
              </button>
            </div>
          </div>

          <!-- Cloud Endpoint Config -->
          <div class="cloud-config-card">
            <h3>⚙️ Cloud Endpoint Configuration</h3>
            <p class="cloud-config-desc">Enter the URL for your Firebase Realtime Database or any REST service compatible with PUT/GET.</p>
            <div class="cloud-input-row">
              <input type="url" class="form-input cloud-url-input" [(ngModel)]="cloudEndpointInput" name="cloudurl" placeholder="https://your-project-default-rtdb.firebaseio.com/portfolio_data.json" />
              <button class="btn btn-primary" (click)="saveCloudEndpoint()">💾 Save &amp; Sync</button>
              <button class="btn btn-outline" (click)="resetCloudEndpoint()">🔄 Restore Default</button>
            </div>
            <div class="cloud-url-active">
              <span>Active endpoint:</span> <code>{{ cloudSync.cloudEndpoint() }}</code>
            </div>
          </div>

          <!-- Force Sync Section -->
          <div class="cloud-force-section">
            <button class="btn btn-primary btn-large" (click)="forceSyncNow()">
              🔄 Pull from Cloud (Download)
            </button>
            <button class="btn btn-primary btn-large" (click)="forcePushNow()" style="margin-left: 0.75rem; background: linear-gradient(135deg, #10b981, #059669); border: none;">
              ☁️ Push to Cloud (Upload All)
            </button>
            <p>Sincroniza y propaga todos los proyectos, blogs y datos a todos tus dispositivos.</p>
          </div>
        </section>

      </div>

      <!-- ═══════════════════════════════════════════════
           PROJECT MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showProjectModal" (click)="showProjectModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingProject ? 'Edit Project' : 'Add New Project' }}</h3>
          <form (ngSubmit)="saveProject()">
            <div class="form-group">
              <label>Project Title *</label>
              <input type="text" class="form-input" [(ngModel)]="projectForm.title" name="title" required placeholder="e.g., Core Banking System" />
            </div>
            <div class="form-group">
              <label>Short Description (Card) *</label>
              <textarea class="form-input" [(ngModel)]="projectForm.description" name="description" rows="2" required placeholder="Concise summary..."></textarea>
            </div>
            <div class="form-group">
              <label>Detailed Description (Detail Modal)</label>
              <textarea class="form-input" [(ngModel)]="projectForm.longDescription" name="longDescription" rows="4" placeholder="Comprehensive explanation of stack, architecture, metrics, etc..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select class="form-input form-select" [(ngModel)]="projectForm.category" name="category">
                  <option value="fullstack">Full Stack</option>
                  <option value="backend">Backend</option>
                  <option value="frontend">Frontend</option>
                  <option value="data">Data Engineering & Analytics</option>
                  <option value="ai">AI & Machine Learning</option>
                  <option value="mobile">Mobile Apps</option>
                  <option value="devops">Cloud & DevOps</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div class="form-group">
                <label>Year</label>
                <input type="number" class="form-input" [(ngModel)]="projectForm.year" name="year" placeholder="2026" />
              </div>
            </div>
            <div class="form-group">
              <label>Technologies (Comma-separated)</label>
              <input type="text" class="form-input" [(ngModel)]="techsString" name="techs" placeholder="Angular, C#, .NET Core, SQL Server, Docker" />
            </div>

            <!-- Photos Carousel Upload (Up to 3 images) -->
            <div class="form-group">
              <label>📸 Carousel Photos (Up to 3 images)</label>
              <div class="carousel-uploader-box">
                <div class="thumbnails-preview-row">
                  <div *ngFor="let img of projectImages; let idx = index" class="thumb-preview-item">
                    <img [src]="img" [alt]="'Photo ' + (idx + 1)" />
                    <button type="button" class="btn-remove-thumb" (click)="removeProjectImage(idx)" title="Delete photo">✕</button>
                    <span class="thumb-badge">Photo {{ idx + 1 }}</span>
                  </div>
                </div>
                <div class="upload-actions-row" *ngIf="projectImages.length < 3">
                  <input type="file" id="proj-img-input" accept="image/*" (change)="onProjectImageUpload($event)" class="file-hidden-input" />
                  <label for="proj-img-input" class="btn btn-sm btn-outline">+ Upload Photo ({{ projectImages.length }}/3)</label>
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
              <label><input type="checkbox" [(ngModel)]="projectForm.featured" name="featured" /> Mark as Featured Project ⭐</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showProjectModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Project</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           BLOG MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showBlogModal" (click)="showBlogModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingBlog ? 'Edit Article' : 'Add New Article' }}</h3>
          <form (ngSubmit)="saveBlog()">
            <div class="form-group">
              <label>Article Title *</label>
              <input type="text" class="form-input" [(ngModel)]="blogForm.title" name="btitle" required placeholder="Article title..." />
            </div>

            <!-- Cover Image Upload -->
            <div class="form-group">
              <label>🖼️ Article Cover Image</label>
              <div class="cover-uploader-box">
                <div *ngIf="blogCoverImage" class="cover-preview-item">
                  <img [src]="blogCoverImage" alt="Cover" />
                  <button type="button" class="btn-remove-thumb" (click)="blogCoverImage = ''" title="Delete cover">✕</button>
                </div>
                <div class="upload-btn-wrap">
                  <input type="file" id="blog-cover-input" accept="image/*" (change)="onBlogCoverUpload($event)" class="file-hidden-input" />
                  <label for="blog-cover-input" class="btn btn-sm btn-outline">📁 {{ blogCoverImage ? 'Change Cover' : 'Upload Cover Image' }}</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Summary / Excerpt *</label>
              <textarea class="form-input" [(ngModel)]="blogForm.excerpt" name="bexcerpt" rows="2" required></textarea>
            </div>
            <div class="form-group">
              <label>Full Content (Paragraphs or text)</label>
              <textarea class="form-input" [(ngModel)]="blogForm.content" name="bcontent" rows="6"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select class="form-input form-select" [(ngModel)]="blogForm.category" name="bcategory">
                  <option value="ai">AI & Machine Learning</option>
                  <option value="data">Data Engineering & Analytics</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps & Cloud</option>
                  <option value="architecture">Software Architecture</option>
                  <option value="career">Career & Leadership</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div class="form-group">
                <label>Read Time (min)</label>
                <input type="number" class="form-input" [(ngModel)]="blogForm.readTime" name="bread" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Publication Date</label>
                <input type="text" class="form-input" [(ngModel)]="blogForm.date" name="bdate" placeholder="September 2026" />
              </div>
              <div class="form-group">
                <label>Tags (Comma-separated)</label>
                <input type="text" class="form-input" [(ngModel)]="tagsString" name="btags" placeholder="Angular, AI, Python" />
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="blogForm.featured" name="bfeatured" /> Featured Article ⭐</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showBlogModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Article</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           SKILL MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showSkillModal" (click)="showSkillModal = false">
        <div class="modal-card modal-sm" (click)="$event.stopPropagation()">
          <h3>{{ editingSkillIndex !== null ? 'Edit Technology' : 'Add Technology' }}</h3>
          <form (ngSubmit)="saveSkill()">
            <div class="form-group">
              <label>Technology Name *</label>
              <input type="text" class="form-input" [(ngModel)]="skillForm.name" name="sname" required placeholder="e.g., Angular, FastAPI, Docker" />
            </div>
            <div class="form-group">
              <label>Category *</label>
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
              <label>Proficiency Level ({{ skillForm.level }}%)</label>
              <input type="range" min="10" max="100" step="5" class="form-range" [(ngModel)]="skillForm.level" name="slevel" />
            </div>
            <div class="form-group">
              <label>Description / Key Concepts</label>
              <input type="text" class="form-input" [(ngModel)]="skillForm.description" name="sdesc" placeholder="RxJS, Signals, Microfrontends..." />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showSkillModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Technology</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           TIMELINE / EXPERIENCE MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showTimelineModal" (click)="showTimelineModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>{{ editingTimelineIndex !== null ? 'Edit Experience' : 'Add Experience' }}</h3>
          <form (ngSubmit)="saveTimeline()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Role / Position *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.role" name="trole" required placeholder="e.g., Investigation Analyst I" />
              </div>
              <div class="form-group flex-1">
                <label>Year *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.year" name="tyear" required placeholder="2024" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Company / Organization *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.company" name="tcompany" required placeholder="BAC, Freelance..." />
              </div>
              <div class="form-group">
                <label>Period (Months & Years) *</label>
                <input type="text" class="form-input" [(ngModel)]="timelineForm.period" name="tperiod" required placeholder="Oct 2024 - Present" />
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="form-group">
              <label>Company Logo (Upload image or use URL)</label>
              <div class="logo-uploader-row">
                <div *ngIf="timelineForm.companyLogo" class="logo-preview-box">
                  <img [src]="timelineForm.companyLogo" alt="Logo preview" />
                  <button type="button" class="btn-remove-thumb" (click)="timelineForm.companyLogo = ''">✕</button>
                </div>
                <input type="file" id="time-logo-input" accept="image/*" (change)="onTimelineLogoUpload($event)" class="file-hidden-input" />
                <label for="time-logo-input" class="btn btn-sm btn-outline">📁 Upload Logo</label>
                <input type="text" class="form-input" style="flex:1" [(ngModel)]="timelineForm.companyLogo" name="tlogo" placeholder="Or paste image URL..." />
              </div>
            </div>

            <div class="form-group">
              <label>Responsibilities & Achievements Description *</label>
              <textarea class="form-input" [(ngModel)]="timelineForm.description" name="tdesc" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>Skills / Tags (Comma-separated)</label>
              <input type="text" class="form-input" [(ngModel)]="timelineTagsString" name="ttags" placeholder="Data Analysis, Power BI, Python" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showTimelineModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Experience</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           CERTIFICATION MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showCertModal" (click)="showCertModal = false">
        <div class="modal-card modal-sm" (click)="$event.stopPropagation()">
          <h3>{{ editingCertIndex !== null ? 'Edit Certification' : 'Add Certification' }}</h3>
          <form (ngSubmit)="saveCert()">
            <div class="form-group">
              <label>Degree / Certification Name *</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.name" name="cname" required placeholder="e.g., Professional MBA with an emphasis in Management" />
            </div>
            <div class="form-group">
              <label>Issuing Institution / University *</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.issuer" name="cissuer" required placeholder="Universidad de Costa Rica (UCR)" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Period / Year</label>
                <input type="text" class="form-input" [(ngModel)]="certForm.year" name="cyear" placeholder="Sep 2025 - Present" />
              </div>
              <div class="form-group">
                <label>Status / Level</label>
                <select class="form-input form-select" [(ngModel)]="certForm.level" name="clevel">
                  <option value="Completed">Completed</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Specialization">Specialization</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Icon (Emoji)</label>
              <input type="text" class="form-input" [(ngModel)]="certForm.icon" name="cicon" placeholder="🎓, 📊, 💻" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showCertModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Certification</button>
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
            <span class="label">Subject:</span> {{ selectedMsg.subject }}
          </div>
          <div class="msg-popup-body">{{ selectedMsg.message }}</div>
          <div class="msg-popup-footer">
            <a [href]="'mailto:' + selectedMsg.email + '?subject=Re: ' + selectedMsg.subject" class="btn btn-primary">✉️ Reply via Email</a>
            <button class="btn btn-outline" (click)="selectedMsg = null">Close</button>
          </div>
        </div>
      </div>



      <!-- ═══════════════════════════════════════════════
           DOC MODAL (Add/Edit Technical Docs)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showDocModal" (click)="showDocModal = false">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          <h3>{{ editingDoc ? 'Edit Technical Document' : 'Create New Technical Document' }}</h3>
          <form (ngSubmit)="saveDoc()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Document Title *</label>
                <input type="text" class="form-input" [(ngModel)]="docForm.title" name="dtitle" required placeholder="e.g., Complete Architecture Guide for the Portfolio" />
              </div>
              <div class="form-group flex-1">
                <label>Icon (Emoji)</label>
                <input type="text" class="form-input" [(ngModel)]="docForm.icon" name="dicon" placeholder="📘" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <input type="text" class="form-input" [(ngModel)]="docForm.category" name="dcat" placeholder="Architecture, CI/CD, Frontend..." />
              </div>
              <div class="form-group">
                <label>Estimated Read Time</label>
                <input type="text" class="form-input" [(ngModel)]="docForm.estimatedReadTime" name="dread" placeholder="12 min" />
              </div>
            </div>
            <div class="form-group">
              <label>Author</label>
              <input type="text" class="form-input" [(ngModel)]="docForm.author" name="dauthor" placeholder="Steven Piedra Villalta" />
            </div>
            <div class="form-group">
              <label>Summary / Brief Description *</label>
              <textarea class="form-input form-textarea" [(ngModel)]="docForm.summary" name="dsummary" rows="2" required placeholder="Comprehensive technical procedure..."></textarea>
            </div>
            <div class="form-group">
              <label>Tags (Comma-separated)</label>
              <input type="text" class="form-input" [(ngModel)]="docTagsString" name="dtags" placeholder="Angular, Signals, Cloud Sync, Glassmorphism" />
            </div>
            <div class="form-group">
              <label>Full Content (Supports Markdown)</label>
              <textarea class="form-input form-textarea doc-content-area" [(ngModel)]="docForm.content" name="dcontent" rows="12" placeholder="## Section 1&#10;&#10;Detailed description here...&#10;&#10;### Subsection&#10;- Point 1&#10;- Point 2"></textarea>
              <p class="input-help">Supports headers (## ###), lists (- ), code (\`\`\`), bold (**text**).</p>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="docForm.isFeatured" name="dfeatured" /> Featured Document ⭐ (Appears first in the Contact section)</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showDocModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">💾 Save Document</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           CONTACT LINK MODAL (Add/Edit)
      ═══════════════════════════════════════════════ -->
      <div class="modal-backdrop" *ngIf="showLinkModal" (click)="showLinkModal = false">
        <div class="modal-card modal-sm" (click)="$event.stopPropagation()">
          <h3>{{ editingLink ? 'Edit Contact Channel' : 'Add Contact Channel' }}</h3>
          <form (ngSubmit)="saveLink()">
            <div class="form-group">
              <label>Channel Name *</label>
              <input type="text" class="form-input" [(ngModel)]="linkForm.title" name="ltitle" required placeholder="Email, LinkedIn, WhatsApp..." />
            </div>
            <div class="form-group">
              <label>Subtitle / Handle</label>
              <input type="text" class="form-input" [(ngModel)]="linkForm.subtitle" name="lsub" placeholder="yourname@gmail.com, @username..." />
            </div>
            <div class="form-group">
              <label>URL / Link *</label>
              <input type="text" class="form-input" [(ngModel)]="linkForm.url" name="lurl" required placeholder="mailto:..., https://linkedin.com/..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Icon</label>
                <select class="form-input form-select" [(ngModel)]="linkForm.icon" name="licon">
                  <option value="email">✉️ Email</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="github">🐙 GitHub</option>
                  <option value="whatsapp">📱 WhatsApp</option>
                  <option value="location">📍 Location</option>
                  <option value="custom">🔗 Custom Link</option>
                </select>
              </div>
              <div class="form-group">
                <label>Type</label>
                <select class="form-input form-select" [(ngModel)]="linkForm.type" name="ltype">
                  <option value="email">Email (mailto:)</option>
                  <option value="url">URL (https://)</option>
                  <option value="tel">Phone (tel:)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Display Order</label>
              <input type="number" class="form-input" [(ngModel)]="linkForm.order" name="lorder" min="1" />
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="linkForm.isPrimary" name="lprimary" /> Primary Channel (Appears first)</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="showLinkModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">💾 Save Channel</button>
            </div>
          </form>
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

    /* Sync Status Bar */
    .sync-status-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.75rem;
      padding: 0.5rem 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      font-size: 0.82rem;
      color: #94A3B8;
      width: fit-content;
    }

    .sync-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #64748B;
      flex-shrink: 0;
      &.synced { background: #22c55e; }
      &.syncing { background: #f59e0b; }
      &.offline { background: #94a3b8; }
      &.error { background: #ef4444; }
    }

    .btn-sync-now {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60A5FA;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 0.78rem;
      cursor: pointer;
      &:hover { background: rgba(59, 130, 246, 0.3); }
    }

    /* Cloud Sync Tab Styles */
    .cloud-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .cloud-stat-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      &.status-synced { border-color: rgba(34, 197, 94, 0.3); }
      &.status-syncing { border-color: rgba(245, 158, 11, 0.3); }
      &.status-offline { border-color: rgba(100, 116, 139, 0.3); }
      &.status-error { border-color: rgba(239, 68, 68, 0.3); }
    }

    .cloud-stat-icon { font-size: 2rem; flex-shrink: 0; }
    .cloud-stat-info { flex: 1; }
    .cloud-stat-label { font-size: 0.78rem; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .cloud-stat-value { font-size: 1rem; font-weight: 600; color: #F8FAFC; }
    .cloud-stat-sub { font-size: 0.8rem; color: #64748B; margin-top: 0.25rem; }

    .cloud-config-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.75rem;
      margin-bottom: 2rem;

      h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #F8FAFC; }
    }

    .cloud-config-desc { color: #94A3B8; font-size: 0.9rem; margin-bottom: 1rem; }

    .cloud-input-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .cloud-url-input { flex: 1; min-width: 280px; }

    .cloud-url-active {
      font-size: 0.82rem;
      color: #64748B;
      code { color: #60A5FA; font-size: 0.82rem; word-break: break-all; }
    }

    .cloud-force-section {
      text-align: center;
      padding: 2rem;
      border: 1px dashed rgba(59, 130, 246, 0.3);
      border-radius: 14px;
      p { color: #94A3B8; margin-top: 0.75rem; font-size: 0.9rem; }
    }

    .btn-large { padding: 1rem 2.5rem; font-size: 1.1rem; }

    /* Contact Links Cards */
    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .link-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: border-color 0.2s;
      &:hover { border-color: rgba(59, 130, 246, 0.35); }
    }

    .link-card-icon { font-size: 1.75rem; flex-shrink: 0; }
    .link-card-info { flex: 1; min-width: 0; }
    .link-card-title { font-weight: 600; color: #F8FAFC; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; }
    .link-card-sub { font-size: 0.82rem; color: #94A3B8; margin: 0.15rem 0; }
    .link-card-url { font-size: 0.78rem; color: #60A5FA; text-decoration: none; word-break: break-all; &:hover { text-decoration: underline; } }
    .link-card-actions { display: flex; gap: 0.4rem; }

    /* Quick Email Banner */
    .quick-email-banner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.25rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;

      p { margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #94A3B8; }
      strong { color: #C7D2FE; }
    }

    .quick-email-info { display: flex; align-items: flex-start; gap: 0.75rem; }
    .q-email-icon { font-size: 1.75rem; flex-shrink: 0; }
    .quick-email-action { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; min-width: 300px; }

    /* Doc & general badges */
    .badge-primary { background: rgba(99, 102, 241, 0.2); color: #A5B4FC; border: 1px solid rgba(99, 102, 241, 0.3); padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.72rem; }
    .tag-mini-list { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .tag-mini { background: rgba(59, 130, 246, 0.12); color: #93C5FD; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.75rem; }
    .icon-cell { font-size: 1.5rem; text-align: center; }
    .doc-content-area { font-family: 'JetBrains Mono', monospace; font-size: 0.88rem; line-height: 1.5; }
    .input-help { font-size: 0.8rem; color: #64748B; margin-top: 0.3rem; }
    .modal-lg { max-width: 800px !important; }


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
  readonly cloudSync = inject(CloudSyncService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'projects' | 'blogs' | 'about' | 'metrics' | 'contact' | 'contactlinks' | 'docs' | 'cloudsync'>('projects');

  projects = this.portfolioService.projectsSignal;
  blogs = this.portfolioService.blogPostsSignal;
  skills = this.portfolioService.skillsSignal;
  contactMsgs = this.portfolioService.contactMsgsSignal;
  aboutInfo = this.portfolioService.aboutInfoSignal;
  technicalDocs = this.portfolioService.technicalDocsSignal;
  contactLinks = this.portfolioService.contactLinksSignal;

  // Cloud sync config
  cloudEndpointInput = '';

  // TechnicalDoc modal
  showDocModal = false;
  editingDoc: TechnicalDoc | null = null;
  docForm: Partial<TechnicalDoc> = {};
  docTagsString = '';

  // ContactLink modal
  showLinkModal = false;
  editingLink: ContactLinkItem | null = null;
  linkForm: Partial<ContactLinkItem> = {};

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
        if (t === 'projects' || t === 'blogs' || t === 'metrics' || t === 'about' || t === 'contact' || t === 'contactlinks' || t === 'docs' || t === 'cloudsync') {
          this.activeTab.set(t as any);
        } else if (t === 'blog') {
          this.activeTab.set('blogs');
        }
      }
    });
    // Initialize cloud endpoint input
    this.cloudEndpointInput = this.cloudSync.cloudEndpoint();

    // Refresh about form with current state, ensuring timeline & certifications are safely preserved
    const currentAbout = this.portfolioService.getAboutInfo();
    this.aboutForm = {
      ...currentAbout,
      timeline: (currentAbout.timeline && currentAbout.timeline.length > 0)
        ? [...currentAbout.timeline]
        : [...(this.portfolioService.aboutInfoSignal().timeline || [])],
      certifications: (currentAbout.certifications && currentAbout.certifications.length > 0)
        ? [...currentAbout.certifications]
        : [...(this.portfolioService.aboutInfoSignal().certifications || [])]
    };
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
      title: this.projectForm.title || 'New Project',
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
    if (confirm('Are you sure you want to delete this project and its photos?')) {
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
      date: 'September 2026',
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
      title: this.blogForm.title || 'New Article',
      excerpt: this.blogForm.excerpt || '',
      content: this.blogForm.content || '',
      category: this.blogForm.category || 'ai',
      tags: tags,
      readTime: this.blogForm.readTime || 5,
      date: this.blogForm.date || 'September 2026',
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
    if (confirm('Are you sure you want to delete this article?')) {
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
          alert(`CV "${fileName}" uploaded successfully!`);
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
      alert('About Me information saved successfully!');
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
    if (confirm('Delete this technology?')) {
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
    if (confirm('Delete this experience?')) {
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
    if (confirm('Delete this certification?')) {
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
    if (confirm('Delete this contact message?')) {
      this.portfolioService.deleteContactMessage(index);
      this.selectedMsg = null;
    }
  }

  // --- Cloud Sync ---
  forceSyncNow() {
    this.portfolioService.syncFromCloud();
  }

  forcePushNow() {
    this.portfolioService.forcePushToCloud();
  }

  saveCloudEndpoint() {
    if (this.cloudEndpointInput.trim()) {
      this.cloudSync.setCloudEndpoint(this.cloudEndpointInput.trim());
      this.forceSyncNow();
    }
  }

  resetCloudEndpoint() {
    this.cloudSync.resetCloudEndpoint();
    this.cloudEndpointInput = this.cloudSync.cloudEndpoint();
  }

  toggleAutoSync() {
    this.cloudSync.isAutoSyncEnabled.update(v => !v);
  }

  // --- Technical Docs CRUD ---
  openAddDocModal() {
    this.editingDoc = null;
    this.docForm = {
      title: '',
      category: 'Architecture',
      summary: '',
      content: '',
      author: this.portfolioService.getAboutInfo().fullName || 'Steven Piedra',
      icon: '📘',
      estimatedReadTime: '10 min',
      isFeatured: false
    };
    this.docTagsString = 'Angular, TypeScript';
    this.showDocModal = true;
  }

  openEditDocModal(doc: TechnicalDoc) {
    this.editingDoc = doc;
    this.docForm = { ...doc };
    this.docTagsString = (doc.tags || []).join(', ');
    this.showDocModal = true;
  }

  saveDoc() {
    if (!this.docForm.title?.trim()) return;
    const tags = this.docTagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const docData = {
      title: this.docForm.title || '',
      category: this.docForm.category || 'General',
      summary: this.docForm.summary || '',
      content: this.docForm.content || '',
      author: this.docForm.author || '',
      icon: this.docForm.icon || '📘',
      estimatedReadTime: this.docForm.estimatedReadTime || '10 min',
      isFeatured: !!this.docForm.isFeatured,
      tags
    };
    if (this.editingDoc) {
      this.portfolioService.updateTechnicalDoc({ ...docData, id: this.editingDoc.id, lastUpdated: this.editingDoc.lastUpdated });
    } else {
      this.portfolioService.addTechnicalDoc(docData);
    }
    this.showDocModal = false;
  }

  deleteDoc(id: number) {
    if (confirm('Delete this technical document?')) {
      this.portfolioService.deleteTechnicalDoc(id);
    }
  }

  // --- Contact Links CRUD ---
  openAddLinkModal() {
    this.editingLink = null;
    this.linkForm = {
      title: '',
      subtitle: '',
      url: '',
      icon: 'email',
      type: 'url',
      isPrimary: false,
      order: this.contactLinks().length + 1
    };
    this.showLinkModal = true;
  }

  openEditLinkModal(link: ContactLinkItem) {
    this.editingLink = link;
    this.linkForm = { ...link };
    this.showLinkModal = true;
  }

  saveLink() {
    if (!this.linkForm.title?.trim() || !this.linkForm.url?.trim()) return;
    const linkData: Omit<ContactLinkItem, 'id'> = {
      title: this.linkForm.title || '',
      subtitle: this.linkForm.subtitle || '',
      url: this.linkForm.url || '',
      icon: this.linkForm.icon || 'link',
      type: this.linkForm.type || 'url',
      isPrimary: !!this.linkForm.isPrimary,
      order: this.linkForm.order || 1
    };
    if (this.editingLink) {
      this.portfolioService.updateContactLink({ ...linkData, id: this.editingLink.id });
    } else {
      this.portfolioService.addContactLink(linkData);
    }
    this.showLinkModal = false;
  }

  deleteLink(id: string) {
    if (confirm('Delete this contact channel?')) {
      this.portfolioService.deleteContactLink(id);
    }
  }

  updateEmailEverywhere() {
    const email = this.aboutForm.email?.trim();
    if (email) {
      this.portfolioService.updatePrimaryEmail(email);
    }
  }
}
