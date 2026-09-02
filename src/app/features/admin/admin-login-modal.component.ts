import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()" role="dialog" aria-modal="true">
      <div class="login-card" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeModal()" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="login-header">
          <div class="admin-badge">🔒 Secret Admin Portal</div>
          <h2>Ingreso Administrativo</h2>
          <p>Ingrese sus credenciales de administrador para gestionar los datos.</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="admin-user">Usuario</label>
            <input
              id="admin-user"
              type="text"
              class="form-input"
              [(ngModel)]="username"
              name="username"
              placeholder="Admin"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="admin-pass">Contraseña</label>
            <div class="input-eye-wrapper">
              <input
                id="admin-pass"
                [type]="showPassword ? 'text' : 'password'"
                class="form-input"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••••••"
                required
                autocomplete="current-password"
              />
              <button type="button" class="eye-btn" (click)="showPassword = !showPassword" [title]="showPassword ? 'Ocultar' : 'Mostrar'">
                <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="error-msg" *ngIf="errorMessage">
            ⚠️ {{ errorMessage }}
          </div>

          <button type="submit" class="submit-btn">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(4, 9, 20, 0.88);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .login-card {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: #0F172A;
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 20px;
      padding: 2.25rem 2rem;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
      color: #F8FAFC;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover { color: #fff; background: rgba(239, 68, 68, 0.8); }
      svg { width: 16px; height: 16px; }
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.75rem;

      .admin-badge {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #60A5FA;
        background: rgba(59, 130, 246, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.3);
        padding: 0.25rem 0.85rem;
        border-radius: 100px;
        margin-bottom: 0.75rem;
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 800;
        margin-bottom: 0.35rem;
      }

      p {
        font-size: 0.85rem;
        color: #94A3B8;
        margin: 0;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 0.82rem;
        font-weight: 600;
        color: #CBD5E1;
      }
    }

    .form-input {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #fff;
      font-size: 0.95rem;
      width: 100%;

      &:focus {
        outline: none;
        border-color: #3B82F6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
    }

    .input-eye-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .form-input { padding-right: 2.75rem; }
    }

    .eye-btn {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      color: #94A3B8;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      svg { width: 18px; height: 18px; }
      &:hover { color: #60A5FA; }
    }

    .error-msg {
      font-size: 0.82rem;
      color: #F87171;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
    }

    .submit-btn {
      padding: 0.8rem;
      background: #3B82F6;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;

      &:hover {
        background: #2563EB;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
      }
    }
  `]
})
export class AdminLoginModalComponent {
  @Output() close = new EventEmitter<void>();

  username = '';
  password = '';
  showPassword = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      this.closeModal();
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Credenciales inválidas. Verifique usuario y contraseña.';
    }
  }
}
