import { Injectable, signal } from '@angular/core';
import { Project, BlogPost, SiteMetrics, Skill, SocialLink, AboutInfo, ContactMessage } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private readonly PROJECTS_KEY = 'portfolio_projects_v3';
  private readonly BLOGS_KEY = 'portfolio_blogs_v3';
  private readonly METRICS_KEY = 'portfolio_metrics_v3';
  private readonly ABOUT_KEY = 'portfolio_about_v3';
  private readonly CONTACT_MSGS_KEY = 'portfolio_contact_msgs_v3';

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

### Ejemplo de Código
\`\`\`typescript
const count = signal(0);
const doubleCount = computed(() => count() * 2);

function increment() {
  count.update(v => v + 1);
}
\`\`\`

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
4. **Resiliencia con Polly:** Patrones de Circuit Breaker, Retry con Backoff Exponencial y Fallbacks.

### Containerización
Utilizamos Dockerfiles multietapa para compilar imágenes ultraligeras basadas en Alpine Linux (menores a 120MB), garantizando despliegues ultrarrápidos.`,
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

  private initialMetrics: SiteMetrics = {
    githubRepos: 14,
    totalCommits: 420,
    followers: 18,
    articlesPublished: 6,
    blogViews: 12500,
    apisBuilt: 25,
    techStackMastery: 19,
    professionalCerts: 8
  };

  private initialAboutInfo: AboutInfo = {
    fullName: 'Steven Piedra Villalta',
    roleTitle: 'Full Stack Developer | AI Developer | Product Manager',
    bio: 'Desarrollador Full Stack Senior con amplia experiencia en arquitecturas de software escalables, desarrollo de soluciones bancarias, automatización de procesos mediante IA y liderazgo de productos digitales.',
    experienceYears: 4
  };

  private initialContactMsgs: ContactMessage[] = [
    {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@techbank.com',
      subject: 'Oportunidad de desarrollo bancario en C# .NET y Angular',
      message: 'Hola Steven, nos llamó mucho la atención tu experiencia en arquitecturas bancarias core. Quisiéramos agendar una reunión.'
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
  contactMsgsSignal = signal<ContactMessage[]>(this.loadStorage(this.CONTACT_MSGS_KEY, this.initialContactMsgs));

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
    const newProj: Project = { ...project, id: newId };
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

  starProject(id: number): void {
    const updated = this.projectsSignal().map(p => {
      if (p.id === id) {
        return { ...p, stars: (p.stars || 0) + 1 };
      }
      return p;
    });
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
  }

  // --- Blog Methods ---
  getBlogPosts(): BlogPost[] {
    return this.blogPostsSignal();
  }

  addBlogPost(post: Omit<BlogPost, 'id'>): void {
    const newId = Date.now();
    const newPost: BlogPost = { ...post, id: newId };
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

  likeBlogPost(id: number): void {
    const updated = this.blogPostsSignal().map(b => {
      if (b.id === id) {
        return { ...b, likes: b.likes + 1 };
      }
      return b;
    });
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
  }

  // --- Metrics Methods ---
  getMetrics(): SiteMetrics {
    const current = this.metricsSignal();
    return {
      ...current,
      articlesPublished: this.blogPostsSignal().length
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

  // --- Skills & Links ---
  getSkills(): Skill[] {
    return [
      { name: 'Angular', level: 80, category: 'frontend', description: 'Standalone components, Signals, RxJS, state management, reactive forms' },
      { name: 'React', level: 70, category: 'frontend', description: 'Hooks, Context API, Redux Toolkit, Next.js integration' },
      { name: 'Next.js', level: 75, category: 'frontend', description: 'App Router, Server Components, SSR/SSG, API Routes' },
      { name: 'TypeScript', level: 85, category: 'frontend', description: 'Strict typing, generics, interfaces, OOP & functional paradigms' },
      { name: 'Tailwind CSS', level: 75, category: 'frontend', description: 'Utility-first styling, custom themes, responsive layouts' },
      { name: 'Python', level: 75, category: 'backend', description: 'Data structures, backend services, script automation, AI pipelines' },
      { name: 'FastAPI', level: 65, category: 'backend', description: 'Async RESTful APIs, Pydantic validation, OpenAPI specs' },
      { name: 'Node.js', level: 60, category: 'backend', description: 'Express framework, REST services, async event loop' },
      { name: 'C# / .NET', level: 60, category: 'backend', description: 'ASP.NET Core, Entity Framework, enterprise backend architectures' },
      { name: 'SQL', level: 70, category: 'databases', description: 'Relational data modeling, complex joins, index optimization' },
      { name: 'PostgreSQL', level: 70, category: 'databases', description: 'Advanced queries, JSONB support, transaction management' },
      { name: 'MongoDB', level: 60, category: 'databases', description: 'NoSQL collections, aggregation framework, schema design' },
      { name: 'Redis', level: 50, category: 'databases', description: 'In-memory key-value cache, pub/sub messaging' },
      { name: 'Firebase', level: 70, category: 'databases', description: 'Firestore NoSQL, real-time database, Authentication, Functions' },
      { name: 'Git & GitHub', level: 85, category: 'tools', description: 'Branch management, pull requests, GitHub Actions CI/CD' },
      { name: 'Docker', level: 65, category: 'cloud', description: 'Containerization, Docker Compose, multi-stage builds' },
      { name: 'Agile & Scrum', level: 85, category: 'methodologies', description: 'Sprint planning, backlog prioritization, product management' },
      { name: 'AI & Prompt Eng.', level: 80, category: 'methodologies', description: 'LLM integration, RAG architectures, prompt optimization' },
      { name: 'UI/UX Design', level: 75, category: 'methodologies', description: 'Wireframing, modern design systems, glassmorphism, accessibility' }
    ];
  }

  getSocialLinks(): SocialLink[] {
    return [
      { platform: 'GitHub', url: 'https://github.com/StevenPiedra-dev', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/stevenpiedra/', icon: 'linkedin' },
      { platform: 'Email', url: 'mailto:steven.piedra02@gmail.com', icon: 'email' }
    ];
  }
}
