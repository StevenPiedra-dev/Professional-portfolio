import {
  Component,
  OnInit,
  inject,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project, Skill } from '../../core/models/portfolio.models';
import { ParticlesComponent } from '../../shared/components/particles/particles.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ParticlesComponent, ProjectCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private portfolioService = inject(PortfolioService);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  skills = signal<Skill[]>([]);
  activeSkillCategory = signal<string>('all');
  isMenuOpen = signal(false);
  contactSent = signal(false);
  activeSection = signal('hero');
  readonly currentYear = new Date().getFullYear();

  contactForm!: FormGroup;

  readonly skillCategories = [
    { id: 'all', label: 'Todas' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'tools', label: 'Herramientas' },
    { id: 'cloud', label: 'Cloud' }
  ];

  readonly navLinks = [
    { id: 'hero', label: 'Inicio' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'contact', label: 'Contacto' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    this.projects.set(this.portfolioService.getProjects());
    this.skills.set(this.portfolioService.getSkills());
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollSpy();
      this.initScrollReveal();
    }
  }

  get filteredSkills(): Skill[] {
    const cat = this.activeSkillCategory();
    return cat === 'all'
      ? this.skills()
      : this.skills().filter(s => s.category === cat);
  }

  get featuredProjects(): Project[] {
    return this.projects().filter(p => p.featured);
  }

  filterSkills(category: string): void {
    this.activeSkillCategory.set(category);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  submitContact(): void {
    if (this.contactForm.valid) {
      console.log('Contact form submitted:', this.contactForm.value);
      this.contactSent.set(true);
      this.contactForm.reset();
      setTimeout(() => this.contactSent.set(false), 5000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  private initScrollSpy(): void {
    const sections = ['hero', 'projects', 'skills', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  getSkillBarColor(level: number): string {
    if (level >= 85) return 'var(--blue-500)';
    if (level >= 70) return 'var(--blue-400)';
    return 'var(--blue-300)';
  }
}
