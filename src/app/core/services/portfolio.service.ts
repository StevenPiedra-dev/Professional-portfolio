import { Injectable, signal } from '@angular/core';
import { Project, BlogPost, SiteMetrics, Skill, SocialLink, AboutInfo, ContactMessage } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private readonly PROJECTS_KEY = 'portfolio_projects_v4';
  private readonly BLOGS_KEY = 'portfolio_blogs_v4';
  private readonly METRICS_KEY = 'portfolio_metrics_v4';
  private readonly ABOUT_KEY = 'portfolio_about_v4';
  private readonly SKILLS_KEY = 'portfolio_skills_v4';
  private readonly CONTACT_MSGS_KEY = 'portfolio_contact_msgs_v4';
  private readonly USER_VOTES_KEY = 'portfolio_user_votes_v4';

  private initialProjects: Project[] = [
    {
      id: 1,
      title: 'Enterprise Banking Core System',
      description: 'Scalable microservices architecture for real-time transaction processing, account management, and financial compliance auditing.',
      longDescription: 'High-performance core banking platform built with C# .NET Core and Angular. Handles multi-currency transfers, automated fraud detection alerts, ISO 20022 message specs, and seamless integrations with external clearing networks. Optimized for high throughput and zero-downtime database failovers.',
      technologies: ['Angular', 'C#', '.NET Core', 'SQL Server', 'Azure', 'Docker'],
      imageUrl: 'assets/projects/ecommerce.jpg',
      images: [
        'assets/projects/ecommerce.jpg',
        'assets/projects/taskmanager.jpg',
        'assets/projects/weather.jpg'
      ],
      githubUrl: 'https://github.com/StevenPiedra-dev',
      featured: true,
      stars: 12,
      category: 'backend',
      year: 2025
    },
    {
      id: 2,
      title: 'AI Smart Assistant & Workflow Automator',
      description: 'Intelligent prompt engineering engine and document processing API leveraging LLMs, vector search, and FastAPI.',
      longDescription: 'End-to-end RAG (Retrieval-Augmented Generation) system built using Python, FastAPI, and ChromaDB/PGVector. Enables contextual question-answering over unstructured enterprise contracts, PDF reports, and technical documentation with hybrid keyword/semantic search.',
      technologies: ['Python', 'FastAPI', 'React', 'OpenAI API', 'Docker', 'LangChain'],
      imageUrl: 'assets/projects/taskmanager.jpg',
      images: [
        'assets/projects/taskmanager.jpg',
        'assets/projects/weather.jpg',
        'assets/projects/microservices.jpg'
      ],
      githubUrl: 'https://github.com/StevenPiedra-dev',
      featured: true,
      stars: 18,
      category: 'ai',
      year: 2025
    },
    {
      id: 3,
      title: 'Real-Time Analytics & Monitoring Dashboard',
      description: 'High-frequency telemetry dashboard visualizing operational metrics, system health, and custom KPIs with sub-second latency.',
      longDescription: 'Enterprise monitoring software connecting WebSocket telemetry feeds directly into dynamic SVG charts and heatmaps. Features configurable threshold alerts, multi-tenant workspace partitioning, and real-time query aggregation over time-series data.',
      technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'TypeScript'],
      imageUrl: 'assets/projects/weather.jpg',
      images: [
        'assets/projects/weather.jpg',
        'assets/projects/microservices.jpg',
        'assets/projects/ecommerce.jpg'
      ],
      githubUrl: 'https://github.com/StevenPiedra-dev',
      featured: true,
      stars: 15,
      category: 'frontend',
      year: 2024
    },
    {
      id: 4,
      title: 'Microservices Gateway & Cloud Orchestrator',
      description: 'Cloud-native API Gateway with rate limiting, JWT authentication, containerization, and automated CI/CD pipelines.',
      longDescription: 'Lightweight reverse-proxy gateway engineered in Node.js and Go. Manages API rate-limiting via Redis token buckets, JWT validation, automated CORS headers, and load balancing across Docker containers deployed on GCP Cloud Run.',
      technologies: ['Node.js', 'Docker', 'Firebase', 'Git', 'GCP', 'Redis'],
      imageUrl: 'assets/projects/microservices.jpg',
      images: [
        'assets/projects/microservices.jpg',
        'assets/projects/ecommerce.jpg',
        'assets/projects/taskmanager.jpg'
      ],
      githubUrl: 'https://github.com/StevenPiedra-dev',
      featured: false,
      stars: 9,
      category: 'devops',
      year: 2024
    }
  ];

  private initialBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Construyendo una API con FastAPI y RAG: De cero a producción',
      excerpt: 'Una guía completa para crear una API inteligente que combina FastAPI con Retrieval-Augmented Generation usando LangChain y embeddings de OpenAI para respuestas contextuales precisas.',
      content: `En este artículo profundizamos en cómo construir una arquitectura RAG (Retrieval-Augmented Generation) de alto rendimiento en producción.

### 1. ¿Por qué RAG?
Los modelos LLM tradicionales sufren de alucinaciones y falta de conocimiento sobre información privada o en tiempo real. RAG combina la potencia de búsqueda en bases de datos vectoriales con la capacidad de generación de lenguaje.

### 2. Stack Tecnológico
- **Backend Framework:** FastAPI (Python 3.11)
- **Vector DB:** Qdrant / PGVector
- **Embeddings:** OpenAI text-embedding-3-small
- **Orquestador:** LangChain / LlamaIndex

### 3. Implementación de Embeddings
Extraemos trozos (chunks) de 500 tokens con un solapamiento de 50 tokens usando RecursiveCharacterTextSplitter. Guardamos los vectores junto con su metadata (ID de documento, página, fecha).

### 4. Búsqueda Híbrida y Re-Ranking
Para mejorar la precisión del contexto recuperado, implementamos recolección híbrida (BM25 + Búsqueda Vectorial por Cosine Similarity) seguida de un paso de Re-Ranking con Cohere Rerank.

### 5. Despliegue en Producción
Servimos la API usando Uvicorn detrás de Nginx con Docker Compose, garantizando tiempos de respuesta promedio menores a 800ms por prompt.`,
      category: 'ai',
      tags: ['FastAPI', 'RAG', 'LangChain', 'OpenAI', 'Python'],
      readTime: 12,
      date: 'Julio 2025',
      icon: '🤖',
      featured: true,
      gradient: 'linear-gradient(135deg, #2a1a5c, #7c3aed)',
      likes: 64
    },
    {
      id: 2,
      title: 'Angular Signals: El futuro de la reactividad en Angular 17+',
      excerpt: 'Explorando el nuevo sistema de reactividad de Angular con Signals. Comparativa con RxJS, casos de uso prácticos y migración de código existente.',
      content: `Angular 17+ ha introducido Signals, cambiando radicalmente la forma en que gestionamos el estado y la detección de cambios en nuestras aplicaciones web.

### ¿Qué son los Signals?
Un Signal es un contenedor reactivo que notifica automáticamente a sus consumidores cuando su valor cambia. A diferencia de RxJS observables, los Signals son síncronos y no requieren desuscripciones manuales ni suscripciones con pipe async.

### Ventajas Clave
1. **Fine-grained Change Detection:** Angular recalcula únicamente los nodos del DOM que dependen directamente del Signal modificado.
2. **Sin mem-leaks por suscripción:** No más \`takeUntilDestroyed()\` ni suscripciones olvidadas.
3. **Interoperabilidad perfecta:** Métodos como \`toSignal()\` y \`toObservable()\` permiten integrar RxJS fácilmente.

### Conclusión
Signals no reemplazan a RxJS en eventos asíncronos complejos, pero simplifican drásticamente el estado local de componentes en Angular moderno.`,
      category: 'frontend',
      tags: ['Angular', 'Signals', 'RxJS', 'TypeScript'],
      readTime: 8,
      date: 'Junio 2025',
      icon: '⚡',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a3a5c, #3B82F6)',
      likes: 48
    },
    {
      id: 3,
      title: 'Microservicios con Docker y .NET Core: Arquitectura práctica',
      excerpt: 'Diseñando un ecosistema de microservicios resiliente con .NET Core, Docker Compose, API Gateway y patrones de comunicación asíncrona con RabbitMQ.',
      content: `Los microservicios permiten escalar equipos y sistemas, pero añaden complejidad operativa. En esta entrada exploramos un diseño arquitectónico probado en proyectos bancarios y empresariales.

### Componentes de la Arquitectura
1. **API Gateway (YARP / Ocelot):** Enrutamiento centralizado, autenticación OAuth2/JWT y control de cuotas.
2. **Services Boundaries:**
   - Auth & User Service (.NET Core API)
   - Transactions & Payments Service (C# .NET)
   - Notification Engine (Node.js)
3. **Event-Driven Messaging:** RabbitMQ para comunicación eventual entre servicios sin acoplamiento síncrono.
4. **Resiliencia con Polly:** Patrones de Circuit Breaker, Retry con Backoff Exponencial y Fallbacks.`,
      category: 'backend',
      tags: ['.NET Core', 'Docker', 'RabbitMQ', 'Microservicios'],
      readTime: 15,
      date: 'Mayo 2025',
      icon: '🔧',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a3a40, #0f766e)',
      likes: 39
    },
    {
      id: 4,
      title: 'CI/CD con GitHub Actions: Automatiza tu pipeline de despliegue',
      excerpt: 'Construye un pipeline de integración y entrega continua desde cero con GitHub Actions. Tests automáticos, análisis de código y despliegue a Azure.',
      content: `La automatización de entregas de software es fundamental para mantener alta velocidad sin sacrificar la estabilidad.

### Fases de nuestro Workflow
- **Lint & Type Check:** Verificación estática con TypeScript y ESLint.
- **Unit & Integration Tests:** Ejecución paralela de suites de pruebas Karma/Jest.
- **Build & Artifact Storage:** Compilación optimizada en producción.
- **Continuous Deployment:** Despliegue automatizado a Vercel/Azure Web Apps al fusionar cambios a la rama \`main\`.`,
      category: 'devops',
      tags: ['GitHub Actions', 'CI/CD', 'Azure', 'Docker'],
      readTime: 10,
      date: 'Abril 2025',
      icon: '🚀',
      featured: false,
      gradient: 'linear-gradient(135deg, #3a2a1a, #b45309)',
      likes: 31
    },
    {
      id: 5,
      title: 'Product Management en startups tech: Lecciones reales',
      excerpt: 'Reflexiones sobre cómo priorizar el backlog, comunicar con stakeholders y tomar decisiones de producto en un entorno startup con recursos limitados.',
      content: `Ser Product Manager en una startup tecnológica requiere equilibrar la velocidad de entrega con la visión a largo plazo.

### Aprendizajes clave:
1. **Focus en el valor del cliente:** No todas las peticiones deben convertirse en código.
2. **Priorización basada en impacto:** Frameworks RICE (Reach, Impact, Confidence, Effort) para ordenar épicas.
3. **Iteraciones cortas:** Lanzamientos semanales y feedback continuo de usuarios reales.`,
      category: 'product',
      tags: ['Product Manager', 'Agile', 'Scrum', 'OKRs'],
      readTime: 7,
      date: 'Marzo 2025',
      icon: '🎯',
      featured: false,
      gradient: 'linear-gradient(135deg, #3a1a3a, #be185d)',
      likes: 28
    },
    {
      id: 6,
      title: 'PostgreSQL avanzado: Indexación, JSONB y performance tuning',
      excerpt: 'Técnicas avanzadas de optimización en PostgreSQL: estrategias de indexación, uso de JSONB para datos semiestructurados y análisis de query plans.',
      content: `PostgreSQL es uno de los motores RDBMS más potentes y versátiles.

### Estrategias de Optimización:
- **Índices GIN y GiST** para acelerar búsquedas en columnas JSONB y geográficas.
- **EXPLAIN ANALYZE:** Análisis profundo de escaneos de tablas (Seq Scan vs Index Scan).
- **Ajuste de autovacuum** para evitar la fragmentación de almacenamiento en tablas de alto tráfico.`,
      category: 'backend',
      tags: ['PostgreSQL', 'SQL', 'Performance', 'Indexación'],
      readTime: 11,
      date: 'Febrero 2025',
      icon: '🗄️',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a2a3a, #1e4d6b)',
      likes: 22
    }
  ];

  private initialSkills: Skill[] = [
    { name: 'Angular', level: 85, category: 'frontend', description: 'Standalone components, Signals, RxJS, state management, reactive forms' },
    { name: 'React', level: 75, category: 'frontend', description: 'Hooks, Context API, Redux Toolkit, Next.js integration' },
    { name: 'Next.js', level: 75, category: 'frontend', description: 'App Router, Server Components, SSR/SSG, API Routes' },
    { name: 'TypeScript', level: 85, category: 'frontend', description: 'Strict typing, generics, interfaces, OOP & functional paradigms' },
    { name: 'Tailwind CSS', level: 80, category: 'frontend', description: 'Utility-first styling, custom themes, responsive layouts' },
    { name: 'Python', level: 80, category: 'backend', description: 'Data structures, backend services, script automation, AI pipelines' },
    { name: 'FastAPI', level: 75, category: 'backend', description: 'Async RESTful APIs, Pydantic validation, OpenAPI specs' },
    { name: 'Node.js', level: 70, category: 'backend', description: 'Express framework, REST services, async event loop' },
    { name: 'C# / .NET', level: 75, category: 'backend', description: 'ASP.NET Core, Entity Framework, enterprise backend architectures' },
    { name: 'SQL & Power BI', level: 85, category: 'databases', description: 'Relational data modeling, complex joins, index optimization, business intelligence' },
    { name: 'PostgreSQL', level: 75, category: 'databases', description: 'Advanced queries, JSONB support, transaction management' },
    { name: 'Azure Database & MySQL', level: 75, category: 'databases', description: 'Cloud DB management, relational design, queries' },
    { name: 'Docker & Cloud', level: 70, category: 'cloud', description: 'Containerization, Docker Compose, Azure/GCP deployments' },
    { name: 'Git & GitHub', level: 85, category: 'tools', description: 'Branch management, pull requests, GitHub Actions CI/CD' },
    { name: 'AI & Prompt Eng.', level: 85, category: 'methodologies', description: 'LLM integration, RAG architectures, prompt optimization' },
    { name: 'Agile & Scrum', level: 90, category: 'methodologies', description: 'Sprint planning, backlog prioritization, product management' }
  ];

  private initialAboutInfo: AboutInfo = {
    fullName: 'Steven Piedra Villalta',
    roleTitle: 'Full Stack Developer | AI Developer | Product Manager',
    bioParagraph1: 'Data Analyst and Full Stack Developer with experience in data analysis and full-stack development. Experienced in data collection and quantitative and qualitative analysis, using tools such as SQL, Python, Power BI, Tableau, and Excel.',
    bioParagraph2: 'Experienced in payment methods and emerging technologies, as well as tools such as .NET Core, React, REST API, Microservices, Azure Database, and MySQL. Deeply passionate about data and how technology enhances business performance and enables more efficient delivery.',
    experienceYears: 4,
    technologiesCount: 16,
    completedProjectsCount: 10,
    cvUrl: 'assets/CV_Steven_Piedra.pdf',
    githubUrl: 'https://github.com/StevenPiedra-dev',
    linkedinUrl: 'https://www.linkedin.com/in/stevenpiedra/',
    email: 'steven.piedra02@gmail.com',
    timeline: [
      {
        year: '2024',
        period: 'Oct 2024 - Present',
        role: 'Investigation Analyst I',
        company: 'BAC, Calle Blancos',
        description: 'Experience using data analysis tools in the financial field and creating executive presentations for senior management and vice presidents. Experience in quantitative and qualitative analysis of Fintechs and payment methods in general. Experience with emerging technologies and businesses that generate new revenue streams for the organization.',
        tags: ['Data Analysis', 'Fintech', 'Presentations'],
        icon: '📊',
        type: 'work'
      },
      {
        year: '2023',
        period: 'Jun 2023 - Sep 2024',
        role: 'Critical Processes Assistant',
        company: 'BAC, Curridabat',
        description: 'I created and managed dashboards in Power BI and Tableau, managed processes with large amounts of data (data acquisition, transformation, and loading). I prepared presentations for senior executives and provided management support.',
        tags: ['Power BI', 'Tableau', 'Data Transformation'],
        icon: '📈',
        type: 'work'
      },
      {
        year: '2022',
        period: 'Jan 2022 - Jan 2023',
        role: 'Fullstack Developer',
        company: 'Freelance, San Pedro',
        description: 'Developing using .NetCore, Azure Database as backend and React as the framework, the project was developed implementing RESTful APIs, authentication modules, and relational database models. Delivered production-ready deployment and user training.',
        tags: ['.NET Core', 'Azure', 'React', 'REST API'],
        icon: '💻',
        type: 'work'
      }
    ],
    certifications: [
      { icon: '🎓', name: 'Professional MBA with an emphasis in Management', issuer: 'Universidad de Costa Rica (UCR)', year: 'Sep 2025 - Present', level: 'In-Progress' },
      { icon: '📊', name: 'Big Data Specialization', issuer: 'Universidad Fidélitas', year: 'Jan 2022 - May 2023', level: 'Completed' },
      { icon: '💻', name: 'Bachelor’s Degree in Systems Engineering', issuer: 'Universidad Fidélitas', year: 'Jan 2020 - Sep 2023', level: 'Completed' }
    ],
    values: [
      { icon: '🏗️', title: 'Clean Code', description: 'I prioritize maintainable, scalable, and well-documented code following SOLID principles and Clean Architecture.' },
      { icon: '🚀', title: 'Continuous Delivery', description: 'Agile methodologies and CI/CD to deliver value quickly and incrementally to the client.' },
      { icon: '🤖', title: 'AI-Driven', description: 'I integrate AI capabilities to build intelligent solutions that solve complex problems.' },
      { icon: '👥', title: 'Collaboration', description: 'I believe in teamwork, open communication, and collective growth to achieve great goals.' }
    ]
  };

  private initialMetrics: SiteMetrics = {
    githubRepos: 14,
    totalCommits: 420,
    followers: 18,
    articlesPublished: 6,
    blogViews: 12500,
    apisBuilt: 25,
    techStackMastery: 16,
    professionalCerts: 3
  };

  private initialContactMsgs: ContactMessage[] = [
    {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@techbank.com',
      subject: 'Oportunidad de desarrollo bancario en C# .NET y Angular',
      message: 'Hola Steven, nos llamó mucho la atención tu experiencia en arquitecturas bancarias core. Quisiéramos agendar una reunión para discutir una posición técnica.'
    },
    {
      name: 'María Fernández',
      email: 'mfernandez@aisolutions.io',
      subject: 'Consulta sobre integración RAG y LangChain',
      message: 'Excelente artículo sobre FastAPI y RAG. Me gustaría colaborar en un proyecto de procesamiento de documentos legales con IA.'
    }
  ];

  // Signals
  projectsSignal = signal<Project[]>(this.loadStorage(this.PROJECTS_KEY, this.initialProjects));
  blogPostsSignal = signal<BlogPost[]>(this.loadStorage(this.BLOGS_KEY, this.initialBlogPosts));
  metricsSignal = signal<SiteMetrics>(this.loadStorage(this.METRICS_KEY, this.initialMetrics));
  aboutInfoSignal = signal<AboutInfo>(this.loadStorage(this.ABOUT_KEY, this.initialAboutInfo));
  skillsSignal = signal<Skill[]>(this.loadStorage(this.SKILLS_KEY, this.initialSkills));
  contactMsgsSignal = signal<ContactMessage[]>(this.loadStorage(this.CONTACT_MSGS_KEY, this.initialContactMsgs));
  userVotesSignal = signal<{ projects: number[]; blogs: number[] }>(this.loadStorage(this.USER_VOTES_KEY, { projects: [], blogs: [] }));

  private loadStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch {}
    return fallback;
  }

  private saveStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  // --- Projects Methods ---
  getProjects(): Project[] {
    return this.projectsSignal();
  }

  addProject(project: Omit<Project, 'id'>): void {
    const newId = Date.now();
    const newProj: Project = { ...project, id: newId, stars: project.stars ?? 0 };
    const updated = [newProj, ...this.projectsSignal()];
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
  }

  updateProject(updatedProject: Project): void {
    const updated = this.projectsSignal().map(p => p.id === updatedProject.id ? updatedProject : p);
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
  }

  deleteProject(id: number): void {
    const updated = this.projectsSignal().filter(p => p.id !== id);
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
  }

  isProjectStarred(id: number): boolean {
    return this.userVotesSignal().projects.includes(id);
  }

  toggleProjectStar(id: number): boolean {
    const votes = this.userVotesSignal();
    const alreadyStarred = votes.projects.includes(id);
    const updatedStarred = alreadyStarred
      ? votes.projects.filter(pId => pId !== id)
      : [...votes.projects, id];

    const updatedVotes = { ...votes, projects: updatedStarred };
    this.userVotesSignal.set(updatedVotes);
    this.saveStorage(this.USER_VOTES_KEY, updatedVotes);

    const updatedProjects = this.projectsSignal().map(p => {
      if (p.id === id) {
        const currentStars = p.stars || 0;
        return { ...p, stars: alreadyStarred ? Math.max(0, currentStars - 1) : currentStars + 1 };
      }
      return p;
    });
    this.projectsSignal.set(updatedProjects);
    this.saveStorage(this.PROJECTS_KEY, updatedProjects);

    return !alreadyStarred;
  }

  starProject(id: number): void {
    this.toggleProjectStar(id);
  }

  // --- Blog Methods ---
  getBlogPosts(): BlogPost[] {
    return this.blogPostsSignal();
  }

  addBlogPost(post: Omit<BlogPost, 'id'>): void {
    const newId = Date.now();
    const newPost: BlogPost = { ...post, id: newId, likes: post.likes ?? 0 };
    const updated = [newPost, ...this.blogPostsSignal()];
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
    this.updateMetrics({ articlesPublished: this.blogPostsSignal().length });
  }

  updateBlogPost(updatedPost: BlogPost): void {
    const updated = this.blogPostsSignal().map(b => b.id === updatedPost.id ? updatedPost : b);
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
  }

  deleteBlogPost(id: number): void {
    const updated = this.blogPostsSignal().filter(b => b.id !== id);
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
    this.updateMetrics({ articlesPublished: updated.length });
  }

  isBlogLiked(id: number): boolean {
    return this.userVotesSignal().blogs.includes(id);
  }

  toggleBlogLike(id: number): boolean {
    const votes = this.userVotesSignal();
    const alreadyLiked = votes.blogs.includes(id);
    const updatedLiked = alreadyLiked
      ? votes.blogs.filter(bId => bId !== id)
      : [...votes.blogs, id];

    const updatedVotes = { ...votes, blogs: updatedLiked };
    this.userVotesSignal.set(updatedVotes);
    this.saveStorage(this.USER_VOTES_KEY, updatedVotes);

    const updatedBlogs = this.blogPostsSignal().map(b => {
      if (b.id === id) {
        return { ...b, likes: alreadyLiked ? Math.max(0, b.likes - 1) : b.likes + 1 };
      }
      return b;
    });
    this.blogPostsSignal.set(updatedBlogs);
    this.saveStorage(this.BLOGS_KEY, updatedBlogs);

    return !alreadyLiked;
  }

  likeBlogPost(id: number): void {
    this.toggleBlogLike(id);
  }

  // --- Metrics Methods ---
  getMetrics(): SiteMetrics {
    const current = this.metricsSignal();
    const about = this.aboutInfoSignal();
    const certsCount = about.certifications ? about.certifications.length : 3;
    const skillsCount = this.skillsSignal().length;
    return {
      ...current,
      articlesPublished: this.blogPostsSignal().length,
      professionalCerts: certsCount,
      techStackMastery: skillsCount
    };
  }

  updateMetrics(partial: Partial<SiteMetrics>): void {
    const updated = { ...this.metricsSignal(), ...partial };
    this.metricsSignal.set(updated);
    this.saveStorage(this.METRICS_KEY, updated);
  }

  // --- About Me Methods ---
  getAboutInfo(): AboutInfo {
    return this.aboutInfoSignal();
  }

  updateAboutInfo(info: AboutInfo): void {
    this.aboutInfoSignal.set(info);
    this.saveStorage(this.ABOUT_KEY, info);
  }

  // --- Skills Methods ---
  getSkills(): Skill[] {
    return this.skillsSignal();
  }

  addSkill(skill: Skill): void {
    const updated = [...this.skillsSignal(), skill];
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
  }

  updateSkill(index: number, skill: Skill): void {
    const updated = [...this.skillsSignal()];
    updated[index] = skill;
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
  }

  deleteSkill(index: number): void {
    const updated = this.skillsSignal().filter((_, i) => i !== index);
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
  }

  // --- Contact Messages Methods ---
  getContactMessages(): ContactMessage[] {
    return this.contactMsgsSignal();
  }

  addContactMessage(msg: ContactMessage): void {
    const updated = [msg, ...this.contactMsgsSignal()];
    this.contactMsgsSignal.set(updated);
    this.saveStorage(this.CONTACT_MSGS_KEY, updated);
  }

  deleteContactMessage(index: number): void {
    const updated = this.contactMsgsSignal().filter((_, i) => i !== index);
    this.contactMsgsSignal.set(updated);
    this.saveStorage(this.CONTACT_MSGS_KEY, updated);
  }

  getSocialLinks(): SocialLink[] {
    const about = this.aboutInfoSignal();
    return [
      { platform: 'GitHub', url: about.githubUrl || 'https://github.com/StevenPiedra-dev', icon: 'github' },
      { platform: 'LinkedIn', url: about.linkedinUrl || 'https://www.linkedin.com/in/stevenpiedra/', icon: 'linkedin' },
      { platform: 'Email', url: `mailto:${about.email || 'steven.piedra02@gmail.com'}`, icon: 'email' }
    ];
  }
}
