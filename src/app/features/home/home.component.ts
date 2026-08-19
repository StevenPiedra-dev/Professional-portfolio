import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services
import { PortfolioService } from '../../core/services/portfolio.service';
import { GithubService } from '../../core/services/github.service';
import { ContactService } from '../../core/services/contact.service';

// Models
import { Project, Skill, GitHubProfile, GitHubRepo, GitHubEvent, SiteMetrics } from '../../core/models/portfolio.models';

// Components
import { ParticlesComponent } from '../../shared/components/particles/particles.component';
import { CounterCardComponent } from '../../shared/components/counter-card/counter-card.component';
import { TechCardComponent } from '../../shared/components/tech-card/tech-card.component';
import { ChartBarComponent, BarData } from '../../shared/components/chart-bar/chart-bar.component';
import { ChartDonutComponent, DonutSegment } from '../../shared/components/chart-donut/chart-donut.component';
import { ChartLineComponent, PointData } from '../../shared/components/chart-line/chart-line.component';
import { HeatmapComponent } from '../../shared/components/heatmap/heatmap.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { ProjectDetailModalComponent } from '../../shared/components/project-detail-modal/project-detail-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ParticlesComponent,
    CounterCardComponent,
    TechCardComponent,
    ChartBarComponent,
    ChartDonutComponent,
    ChartLineComponent,
    HeatmapComponent,
    ProjectCardComponent,
    ProjectDetailModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private githubService = inject(GithubService);
  private contactService = inject(ContactService);

  // Data signals
  skills = signal<Skill[]>([]);
  projects = computed(() => this.portfolioService.projectsSignal().filter(p => p.featured));
  selectedProject = signal<Project | null>(null);

  githubProfile = signal<GitHubProfile | null>(null);
  githubRepos = signal<GitHubRepo[]>([]);
  githubEvents = signal<GitHubEvent[]>([]);

  metrics = computed(() => this.portfolioService.getMetrics());

  // Filtering
  selectedCategory = signal<string>('all');

  // Chart data signals
  stackDonutSegments = signal<DonutSegment[]>([]);
  topSkillsBarData = signal<BarData[]>([]);
  commitLinePoints = signal<PointData[]>([]);

  categoriesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'databases', label: 'Databases' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'tools', label: 'Tools' },
    { id: 'methodologies', label: 'Methodologies' }
  ];

  // Template aliases
  get skillCategories() { return this.categoriesList; }
  activeSkillCategory = this.selectedCategory;

  reposPerYear = [
    { year: '2022', count: 3 },
    { year: '2023', count: 5 },
    { year: '2024', count: 8 },
    { year: '2025', count: 14 }
  ];

  articleCategories = computed(() => {
    const blogs = this.portfolioService.blogPostsSignal();
    const catCounts: Record<string, number> = {};
    blogs.forEach(b => {
      catCounts[b.category] = (catCounts[b.category] || 0) + 1;
    });

    const labels: Record<string, string> = {
      ai: 'IA & ML', frontend: 'Frontend', backend: 'Backend', devops: 'DevOps', product: 'Producto'
    };

    return Object.keys(catCounts).map(cat => ({
      category: labels[cat] || cat,
      count: catCounts[cat]
    }));
  });

  ngOnInit() {
    // Load skills
    const allSkills = this.portfolioService.getSkills();
    this.skills.set(allSkills);

    // Prepare chart data
    this.prepareChartData(allSkills);

    // Fetch GitHub Live Data
    this.githubService.getProfile().subscribe(profile => this.githubProfile.set(profile));
    this.githubService.getRepos().subscribe(repos => this.githubRepos.set(repos));
    this.githubService.getEvents().subscribe(events => this.githubEvents.set(events));
  }

  onSelectProject(project: Project) {
    this.selectedProject.set(project);
  }

  filteredSkills(): Skill[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.skills();
    return this.skills().filter(s => s.category === cat);
  }

  setCategory(catId: string) {
    this.selectedCategory.set(catId);
  }

  heatmapWeeks = Array.from({ length: 30 }, () =>
    Array.from({ length: 7 }, () => ({
      level: Math.floor(Math.random() * 5),
      count: Math.floor(Math.random() * 12)
    }))
  );

  weeklyCommits = [
    { week: 'W1', count: 18 },
    { week: 'W2', count: 25 },
    { week: 'W3', count: 32 },
    { week: 'W4', count: 14 },
    { week: 'W5', count: 42 },
    { week: 'W6', count: 28 },
    { week: 'W7', count: 35 },
    { week: 'W8', count: 48 }
  ];

  getMaxCommitValue(): number {
    return Math.max(...this.weeklyCommits.map(c => c.count), 50);
  }

  scrollTo(sectionId: string) {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openContact() {
    this.openContactModal();
  }

  openContactModal() {
    this.contactService.openModal();
  }

  private prepareChartData(skillsList: Skill[]) {
    const sorted = [...skillsList].sort((a, b) => b.level - a.level).slice(0, 5);
    this.topSkillsBarData.set(sorted.map(s => ({
      label: s.name,
      value: s.level,
      category: s.category
    })));

    const categoryCounts: Record<string, number> = {};
    skillsList.forEach(s => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });

    const donutColors: Record<string, string> = {
      frontend: '#60A5FA',
      backend: '#34D399',
      databases: '#C084FC',
      cloud: '#FBBF24',
      tools: '#F472B6',
      methodologies: '#38BDF8'
    };

    this.stackDonutSegments.set(Object.keys(categoryCounts).map(cat => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: categoryCounts[cat],
      color: donutColors[cat] || '#3B82F6'
    })));

    this.commitLinePoints.set([
      { label: 'Jan', value: 28 },
      { label: 'Feb', value: 45 },
      { label: 'Mar', value: 32 },
      { label: 'Apr', value: 64 },
      { label: 'May', value: 50 },
      { label: 'Jun', value: 78 },
      { label: 'Jul', value: 85 }
    ]);
  }
}
