import { Injectable, inject, signal } from '@angular/core';
import { Project, BlogPost, SiteMetrics, Skill, SocialLink, AboutInfo, ContactMessage, TechnicalDoc, ContactLinkItem, PortfolioData } from '../models/portfolio.models';
import { CloudSyncService } from './cloud-sync.service';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private cloudSync = inject(CloudSyncService);

  private readonly PROJECTS_KEY = 'portfolio_projects_v5';
  private readonly BLOGS_KEY = 'portfolio_blogs_v5';
  private readonly METRICS_KEY = 'portfolio_metrics_v5';
  private readonly ABOUT_KEY = 'portfolio_about_v5';
  private readonly SKILLS_KEY = 'portfolio_skills_v5';
  private readonly CONTACT_MSGS_KEY = 'portfolio_contact_msgs_v5';
  private readonly USER_VOTES_KEY = 'portfolio_user_votes_v5';
  private readonly DOCS_KEY = 'portfolio_technical_docs_v5';
  private readonly CONTACT_LINKS_KEY = 'portfolio_contact_links_v5';

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
      category: 'data',
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
      title: 'Building a Production-Ready RAG API with FastAPI & OpenAI: From Zero to Cloud',
      excerpt: 'A comprehensive engineering guide on architecting an enterprise RAG system with FastAPI, LangChain, vector databases, and OpenAI embeddings for low-latency contextual generation.',
      content: `In this deep-dive article, we explore how to architect and deploy a high-performance Retrieval-Augmented Generation (RAG) system in production environments.

### 1. Why RAG?
Traditional Large Language Models suffer from hallucination and lack real-time access to private enterprise repositories. RAG bridges this gap by marrying low-latency vector search with generative intelligence.

### 2. The Core Stack
- **Backend Framework:** FastAPI (Python 3.11)
- **Vector Database:** Qdrant / PGVector with cosine similarity indexing
- **Embeddings Model:** OpenAI text-embedding-3-small
- **Orchestration:** LangChain & LlamaIndex

### 3. Chunking & Ingestion Strategy
We ingest documents into 500-token chunks with a 50-token rolling overlap using RecursiveCharacterTextSplitter. Each vector is stored alongside contextual metadata (document ID, tenant key, timestamp).

### 4. Hybrid Search & Cross-Encoder Re-Ranking
To maximize recall and precision, our architecture executes hybrid retrieval (BM25 keyword matching + Dense Vector Search), followed by a Cohere Rerank cross-encoder pass before sending prompts to the LLM.

### 5. Production Serving
The API is containerized with Docker, served via Uvicorn behind Nginx, and achieves sub-800ms average response latency under concurrent load.`,
      category: 'ai',
      tags: ['FastAPI', 'RAG', 'LangChain', 'OpenAI', 'Python'],
      readTime: 12,
      date: 'July 2025',
      icon: '🤖',
      featured: true,
      gradient: 'linear-gradient(135deg, #2a1a5c, #7c3aed)',
      likes: 64
    },
    {
      id: 2,
      title: 'Angular Signals: The Evolution of Fine-Grained Reactivity in Modern Web Apps',
      excerpt: 'Exploring the reactivity model of Angular 17+ Signals. In-depth comparison with RxJS observables, practical architectural patterns, and real-world performance gains.',
      content: `Angular 17+ has introduced Signals, revolutionizing state management and change detection across modern web applications.

### What are Signals?
A Signal is a reactive value wrapper that notifies consumers synchronously when its state transitions. Unlike asynchronous RxJS streams, Signals require no explicit teardown, subscriptions, or async pipes.

### Key Architectural Advantages
1. **Fine-grained Change Detection:** Angular computes and repaints only the precise DOM nodes tied to the updated Signal, bypassing unnecessary sub-tree checks.
2. **Elimination of Subscription Memory Leaks:** Say goodbye to complex lifecycle handling and forgotten unsubscriptions.
3. **Seamless Interoperability:** Tools like \`toSignal()\` and \`toObservable()\` provide bidirectional communication with existing RxJS streams.

### Conclusion
Signals do not replace RxJS for complex asynchronous coordination, but they establish a vastly superior standard for component-level UI reactivity.`,
      category: 'frontend',
      tags: ['Angular', 'Signals', 'RxJS', 'TypeScript'],
      readTime: 8,
      date: 'June 2025',
      icon: '⚡',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a3a5c, #3B82F6)',
      likes: 48
    },
    {
      id: 3,
      title: 'Resilient Microservices with Docker and .NET Core: Enterprise Architecture',
      excerpt: 'Designing a fault-tolerant microservices ecosystem using C# .NET Core, Docker Compose, API Gateways, and asynchronous event-driven messaging with RabbitMQ.',
      content: `Microservices unlock agility and autonomous deployment cadences, but they introduce distributed systems challenges. Here is a battle-tested blueprint proven in enterprise financial environments.

### Architectural Blueprint
1. **API Gateway (YARP / Reverse Proxy):** Centralized SSL termination, JWT authorization validation, and rate limiting.
2. **Domain Service Boundaries:**
   - Identity & RBAC Service (.NET Core API)
   - Transactions & Clearing Service (C# .NET)
   - Event Telemetry & Notification Engine (Node.js)
3. **Event-Driven Messaging:** RabbitMQ asynchronous pub/sub ensures non-blocking decoupled communication across services.
4. **Fault Tolerance with Polly:** Circuit Breakers, Exponential Backoff Retries, and Fallback caches to prevent cascading outages.`,
      category: 'backend',
      tags: ['.NET Core', 'Docker', 'RabbitMQ', 'Microservices'],
      readTime: 15,
      date: 'May 2025',
      icon: '🔧',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a3a40, #0f766e)',
      likes: 39
    },
    {
      id: 4,
      title: 'Continuous Delivery with GitHub Actions: Automating Build, Test, and Cloud Deploy',
      excerpt: 'Building an automated CI/CD pipeline from scratch with GitHub Actions. Automated linting, test suites, container builds, and zero-downtime cloud deployments.',
      content: `Automating software delivery is essential for sustaining rapid innovation while maintaining 99.9% platform availability.

### The Automated Workflow Pipeline
- **Static Analysis & Linting:** Strict validation using TypeScript, ESLint, and security scanners.
- **Automated Testing:** Parallel test runners executing unit, contract, and integration suites.
- **Optimized Bundle Compilation:** Tree-shaking and production compression artifacts.
- **Continuous Deployment:** Instant automatic deployments to Vercel and Cloud platforms upon pull request merge to the \`main\` branch.`,
      category: 'devops',
      tags: ['GitHub Actions', 'CI/CD', 'Docker', 'Cloud'],
      readTime: 10,
      date: 'April 2025',
      icon: '🚀',
      featured: false,
      gradient: 'linear-gradient(135deg, #3a2a1a, #b45309)',
      likes: 31
    },
    {
      id: 5,
      title: 'Enterprise Data Pipelines & Real-Time Dashboards: Python, SQL & Power BI',
      excerpt: 'End-to-end strategies for ingesting, transforming, and visualizing large-scale operational data sets with sub-second dashboard query responsiveness.',
      content: `High-performing data teams bridge raw database tables with executive decision-making through resilient ETL/ELT pipelines.

### Data Architecture Strategy:
1. **Automated Extraction:** Python scripts and asynchronous workers collecting structured data from banking and telemetry endpoints.
2. **Transformation & Cleansing:** Pandas and SQL stored procedures validating data integrity, removing duplicates, and structuring analytical star schemas.
3. **Executive Visualization:** Interactive Power BI and Tableau dashboards delivering actionable KPIs and automated alert thresholds to leadership.`,
      category: 'data',
      tags: ['Data Analysis', 'Python', 'SQL', 'Power BI'],
      readTime: 9,
      date: 'March 2025',
      icon: '📊',
      featured: false,
      gradient: 'linear-gradient(135deg, #1e3a5f, #0284c7)',
      likes: 35
    },
    {
      id: 6,
      title: 'Advanced PostgreSQL: Indexing Strategies, JSONB Storage & Performance Tuning',
      excerpt: 'Techniques for database optimization in high-traffic enterprise systems: GIN/GiST index structures, query execution plan analysis, and connection pooling.',
      content: `PostgreSQL is one of the most powerful relational engines when tuned properly for scale.

### Performance Tuning Tactics:
- **GIN & GiST Indexes:** Dramatically accelerating query lookups over JSONB documents and geospatial fields.
- **EXPLAIN (ANALYZE, BUFFERS):** Diagnosing bottleneck sequential scans and cache misses.
- **Autovacuum Optimization:** Preventing storage bloat and lock contention on high-frequency transaction tables.`,
      category: 'backend',
      tags: ['PostgreSQL', 'SQL', 'Performance', 'Database'],
      readTime: 11,
      date: 'February 2025',
      icon: '🗄️',
      featured: false,
      gradient: 'linear-gradient(135deg, #1a2a3a, #1e4d6b)',
      likes: 22
    },
    {
      id: 7,
      title: 'Engineering Leadership & Agile Product Management in Tech Startups',
      excerpt: 'Lessons learned on sprint backlog prioritization frameworks (RICE/MoSCoW), cross-functional team alignment, and balancing velocity with technical debt.',
      content: `Serving as a technical Product Manager requires balancing short-term release momentum with long-term software architecture health.

### Key Takeaways:
1. **Value-First Backlog Management:** Prioritizing features that directly reduce operational friction or drive measurable user impact.
2. **Objective Prioritization:** Leveraging RICE scoring (Reach, Impact, Confidence, Effort) to eliminate subjective roadmap disputes.
3. **Rapid Feedback Loops:** Weekly deployment increments paired with direct telemetry analytics to validate hypotheses early.`,
      category: 'others',
      tags: ['Product Management', 'Agile', 'Scrum', 'Leadership'],
      readTime: 7,
      date: 'January 2025',
      icon: '🎯',
      featured: false,
      gradient: 'linear-gradient(135deg, #3a1a3a, #be185d)',
      likes: 28
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
      name: 'Michael Davis',
      email: 'm.davis@fintechpartners.com',
      subject: 'Core Banking Engineering Opportunity (C# .NET & Angular)',
      message: 'Hi Steven, we came across your banking core architecture background and were very impressed. We would love to schedule an introductory call to discuss our engineering opening.'
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@innovateai.io',
      subject: 'Inquiry regarding Enterprise RAG & LangChain Architecture',
      message: 'Great technical article on FastAPI and RAG implementations. We would like to collaborate on an enterprise document retrieval and AI assistant project.'
    }
  ];

  private initialContactLinks: ContactLinkItem[] = [
    {
      id: 'email-primary',
      title: 'Primary Email',
      subtitle: 'steven.piedra02@gmail.com',
      url: 'mailto:steven.piedra02@gmail.com',
      icon: 'email',
      type: 'email',
      isPrimary: true,
      order: 1
    },
    {
      id: 'linkedin-main',
      title: 'LinkedIn',
      subtitle: 'in/stevenpiedra',
      url: 'https://www.linkedin.com/in/stevenpiedra/',
      icon: 'linkedin',
      type: 'url',
      isPrimary: true,
      order: 2
    },
    {
      id: 'github-main',
      title: 'GitHub',
      subtitle: 'StevenPiedra-dev',
      url: 'https://github.com/StevenPiedra-dev',
      icon: 'github',
      type: 'url',
      isPrimary: true,
      order: 3
    },
    {
      id: 'location-main',
      title: 'Location',
      subtitle: 'San José, Costa Rica (Remote / Worldwide)',
      url: 'https://maps.google.com/?q=San+Jose+Costa+Rica',
      icon: 'location',
      type: 'custom',
      isPrimary: false,
      order: 4
    }
  ];

  private initialTechnicalDocs: TechnicalDoc[] = [
    {
      id: 1,
      title: 'Architecture & Engineering Blueprint: Enterprise Portfolio Platform',
      category: 'Architecture & System Design',
      summary: 'Exhaustive engineering specification, Clean Architecture patterns, modern Angular 17+ Signals reactivity, cloud multi-device synchronization engine, and automated CI/CD pipelines.',
      author: 'Steven Piedra Villalta',
      lastUpdated: 'March 2026',
      tags: ['Angular 17+', 'TypeScript', 'Signals', 'Glassmorphism', 'Cloud Sync', 'CI/CD'],
      icon: '📘',
      estimatedReadTime: '15 min',
      isFeatured: true,
      content: `## 🌟 1. Executive Project Overview

This professional portfolio application was designed and engineered adhering to modern enterprise web standards. It combines an ultra-premium **Glassmorphism design system**, fine-grained reactive state management powered by **Angular 17+ Signals**, and a real-time **Multi-Device Cloud Synchronization Engine**.

---

## 🏛️ 2. Software Architecture & Clean Design Patterns

The repository is structured following **Modular Clean Architecture**:

\`\`\`
src/
├── app/
│   ├── core/                  # Singleton Services, Models & Cloud Engine
│   │   ├── models/            # Strict TypeScript interfaces & data contracts
│   │   └── services/          # PortfolioService, CloudSyncService, AuthService, ContactService
│   ├── features/              # Autonomous Feature Modules
│   │   ├── home/              # Hero presentation, live telemetry dashboard, and KPI metrics
│   │   ├── about/             # Professional biography, interactive career timeline, and certs
│   │   ├── projects/          # Showcase gallery with 3-photo carousel and category filter
│   │   ├── blog/              # Technical publications with interactive likes and reader modal
│   │   ├── contacts/          # Dynamic contact channels and this interactive technical documentation
│   │   └── admin/             # Protected management dashboard with complete CRUD capabilities
│   └── shared/                # Design system primitives, Navbar, Footer, Modales, and Charts
\`\`\`

---

## ⚡ 3. Core Technologies & Frameworks

- **Core Framework:** Angular 17.3+ (Standalone Components, Zero Legacy NgModules).
- **Reactivity Paradigm:** Angular Signals (\`signal()\`, \`computed()\`, \`effect()\`) achieving sub-millisecond change detection with zero memory leaks.
- **Strict Typing:** TypeScript 5.4+ with complete domain model interfaces.
- **Styling Architecture:** Modular SCSS leveraging HSL design tokens, dynamic gradients, Glassmorphism (\`backdrop-filter: blur(16px)\`), and GPU-accelerated micro-interactions.
- **Persistence & Cloud Sync:** Hybrid engine (\`CloudSyncService\`) pairing Firebase Realtime Database REST endpoints with instant \`localStorage\` offline resilience.
- **Continuous Deployment:** Single-Page Application rewrites with Vercel and automated GitHub Actions verification.

---

## 🛠️ 4. Step-by-Step Engineering Workflow

### Phase 1: Project Initialization & Configuration
1. Scaffolded workspace with modern Angular CLI:
   \`\`\`bash
   ng new Professional-portfolio --standalone --routing --style=scss
   \`\`\`
2. Configured \`app.config.ts\` with \`provideHttpClient()\` and hash-location routing for universal static host compatibility.

### Phase 2: Domain Layer & Reactive Core
- Established strict TypeScript interfaces in \`portfolio.models.ts\`: \`Project\`, \`BlogPost\`, \`AboutInfo\`, \`Skill\`, \`TechnicalDoc\`, \`ContactLinkItem\`, \`SiteMetrics\`.
- Engineered \`PortfolioService\` as the Single Reactive Source of Truth.

### Phase 3: Multi-Device Cloud Sync Engine
- Created \`CloudSyncService\` with automatic debouncing (\`500ms\`) to eliminate request congestion.
- Two-way sync: automatically pulls the latest cloud state on startup and window focus, and pushes updates asynchronously upon any administrative action.

### Phase 4: Production User Experience
1. **Interactive Dashboard:** Visualizing live commit velocity, GitHub repository heatmaps, and technology competency breakdowns.
2. **Project Showcase:** 3-photo image carousel, interactive star rating counters, and technology tags.
3. **Blog Engine:** Categorized technical writing with like metrics and rich modal reading views.
4. **Unified Contact Hub:** Dynamically propagated contact channels, email dispatch, and architecture specs.

---

## 🚀 5. Build Verification & Deployment

### Production Compilation:
\`\`\`bash
npm run build
\`\`\`

### Vercel Hosting Configuration (\`vercel.json\`):
\`\`\`json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist/portfolio-steven-piedra/browser",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
\`\`\`

---

## 🔒 6. Security & Performance Best Practices

1. **Lightweight Bundle:** Optimized tree-shaking delivering initial page load times under 1 second.
2. **Protected Management Portal:** Credential-guarded administration interface with session validation.
3. **Offline Durability:** Transparent graceful fallback to local storage if network connectivity drops.
4. **Mobile First & Universal Layouts:** Fully responsive scaling across mobile devices, tablets, and 4K desktop screens.`
    }
  ];

  // Signals
  projectsSignal = signal<Project[]>(this.loadStorage(this.PROJECTS_KEY, this.initialProjects));
  blogPostsSignal = signal<BlogPost[]>(this.loadStorage(this.BLOGS_KEY, this.initialBlogPosts));
  metricsSignal = signal<SiteMetrics>(this.loadStorage(this.METRICS_KEY, this.initialMetrics));
  aboutInfoSignal = signal<AboutInfo>(this.loadStorage(this.ABOUT_KEY, this.initialAboutInfo));
  skillsSignal = signal<Skill[]>(this.loadStorage(this.SKILLS_KEY, this.initialSkills));
  contactMsgsSignal = signal<ContactMessage[]>(this.loadStorage(this.CONTACT_MSGS_KEY, this.initialContactMsgs));
  technicalDocsSignal = signal<TechnicalDoc[]>(this.loadStorage(this.DOCS_KEY, this.initialTechnicalDocs));
  contactLinksSignal = signal<ContactLinkItem[]>(this.loadStorage(this.CONTACT_LINKS_KEY, this.initialContactLinks));
  userVotesSignal = signal<{ projects: number[]; blogs: number[] }>(this.loadStorage(this.USER_VOTES_KEY, { projects: [], blogs: [] }));

  /**
   * Timestamp of the last local write. Used to detect if a cloud fetch is stale
   * (i.e., the local data was modified after the cloud was last updated).
   */
  private _lastLocalWriteAt: number = 0;

  constructor() {
    // Attempt initial cloud sync on startup only
    // NOTE: We intentionally do NOT listen to window.focus to avoid a race
    // condition where the confirm() dialog (delete/edit) causes a focus event
    // that re-downloads stale cloud data and overwrites the local CRUD change.
    this.syncFromCloud();
  }

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

  /**
   * Dispatches cloud sync for all data
   */
  private syncToCloud(): void {
    const fullData: PortfolioData = {
      projects: this.projectsSignal(),
      blogPosts: this.blogPostsSignal(),
      metrics: this.metricsSignal(),
      aboutInfo: this.aboutInfoSignal(),
      skills: this.skillsSignal(),
      contactMsgs: this.contactMsgsSignal(),
      technicalDocs: this.technicalDocsSignal(),
      contactLinks: this.contactLinksSignal(),
      userVotes: this.userVotesSignal(),
      lastSyncedAt: new Date().toISOString()
    };
    this.cloudSync.queueSave(fullData);
  }

  /**
   * Syncs latest data from cloud into local signals and storage.
   * Triple-guarded against overwriting local CRUD changes:
   *  1. fetchFromCloud() returns null immediately if _writeLock is active
   *  2. We re-check hasPendingSave here in case the GET was already in-flight
   *  3. We compare timestamps as a last-resort tie-breaker
   */
  syncFromCloud(): void {
    this.cloudSync.fetchFromCloud().subscribe(data => {
      // Guard 1: a save was queued or is in-flight — never overwrite local edits
      if (this.cloudSync.hasPendingSave) return;

      if (data && data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
        // Guard 2: local data is newer than cloud snapshot — skip overwrite
        const cloudTs = data.lastSyncedAt ? new Date(data.lastSyncedAt).getTime() : 0;
        if (this._lastLocalWriteAt > 0 && this._lastLocalWriteAt > cloudTs) {
          return;
        }

        this.projectsSignal.set(data.projects);
        this.saveStorage(this.PROJECTS_KEY, data.projects);

        if (data.blogPosts && Array.isArray(data.blogPosts)) {
          this.blogPostsSignal.set(data.blogPosts);
          this.saveStorage(this.BLOGS_KEY, data.blogPosts);
        }
        if (data.aboutInfo) {
          this.aboutInfoSignal.set(data.aboutInfo);
          this.saveStorage(this.ABOUT_KEY, data.aboutInfo);
        }
        if (data.skills && Array.isArray(data.skills)) {
          this.skillsSignal.set(data.skills);
          this.saveStorage(this.SKILLS_KEY, data.skills);
        }
        if (data.metrics) {
          this.metricsSignal.set(data.metrics);
          this.saveStorage(this.METRICS_KEY, data.metrics);
        }
        if (data.contactMsgs && Array.isArray(data.contactMsgs)) {
          this.contactMsgsSignal.set(data.contactMsgs);
          this.saveStorage(this.CONTACT_MSGS_KEY, data.contactMsgs);
        }
        if (data.technicalDocs && Array.isArray(data.technicalDocs) && data.technicalDocs.length > 0) {
          this.technicalDocsSignal.set(data.technicalDocs);
          this.saveStorage(this.DOCS_KEY, data.technicalDocs);
        }
        if (data.contactLinks && Array.isArray(data.contactLinks) && data.contactLinks.length > 0) {
          this.contactLinksSignal.set(data.contactLinks);
          this.saveStorage(this.CONTACT_LINKS_KEY, data.contactLinks);
        }
      } else if (data === null) {
        // Cloud database is empty; seed it with current local data
        this.syncToCloud();
      }
    });
  }

  /**
   * Manually pushes all current local data to the cloud
   */
  forcePushToCloud(): void {
    this.syncToCloud();
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
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  updateProject(updatedProject: Project): void {
    const updated = this.projectsSignal().map(p => p.id === updatedProject.id ? updatedProject : p);
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  deleteProject(id: number): void {
    const updated = this.projectsSignal().filter(p => p.id !== id);
    this.projectsSignal.set(updated);
    this.saveStorage(this.PROJECTS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
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
    this.syncToCloud();

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
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  updateBlogPost(updatedPost: BlogPost): void {
    const updated = this.blogPostsSignal().map(b => b.id === updatedPost.id ? updatedPost : b);
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  deleteBlogPost(id: number): void {
    const updated = this.blogPostsSignal().filter(b => b.id !== id);
    this.blogPostsSignal.set(updated);
    this.saveStorage(this.BLOGS_KEY, updated);
    this.updateMetrics({ articlesPublished: updated.length });
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
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
    this.syncToCloud();

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
    this.syncToCloud();
  }

  // --- About Me Methods ---
  getAboutInfo(): AboutInfo {
    return this.aboutInfoSignal();
  }

  updateAboutInfo(info: AboutInfo): void {
    this.aboutInfoSignal.set(info);
    this.saveStorage(this.ABOUT_KEY, info);

    // If email was updated, synchronize contact link email
    if (info.email) {
      this.updatePrimaryEmail(info.email, false);
    }
    this.syncToCloud();
  }

  // --- Skills Methods ---
  getSkills(): Skill[] {
    return this.skillsSignal();
  }

  addSkill(skill: Skill): void {
    const updated = [...this.skillsSignal(), skill];
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  updateSkill(index: number, skill: Skill): void {
    const updated = [...this.skillsSignal()];
    updated[index] = skill;
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  deleteSkill(index: number): void {
    const updated = this.skillsSignal().filter((_, i) => i !== index);
    this.skillsSignal.set(updated);
    this.saveStorage(this.SKILLS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  // --- Technical Docs Methods (CRUD) ---
  getTechnicalDocs(): TechnicalDoc[] {
    return this.technicalDocsSignal();
  }

  addTechnicalDoc(doc: Omit<TechnicalDoc, 'id' | 'lastUpdated'>): void {
    const newId = Date.now();
    const nowStr = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const newDoc: TechnicalDoc = {
      ...doc,
      id: newId,
      lastUpdated: nowStr
    };
    const updated = [newDoc, ...this.technicalDocsSignal()];
    this.technicalDocsSignal.set(updated);
    this.saveStorage(this.DOCS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  updateTechnicalDoc(updatedDoc: TechnicalDoc): void {
    const nowStr = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const updated = this.technicalDocsSignal().map(d =>
      d.id === updatedDoc.id ? { ...updatedDoc, lastUpdated: nowStr } : d
    );
    this.technicalDocsSignal.set(updated);
    this.saveStorage(this.DOCS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  deleteTechnicalDoc(id: number): void {
    const updated = this.technicalDocsSignal().filter(d => d.id !== id);
    this.technicalDocsSignal.set(updated);
    this.saveStorage(this.DOCS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  // --- Contact Links & Channels Methods (CRUD) ---
  getContactLinks(): ContactLinkItem[] {
    return this.contactLinksSignal();
  }

  addContactLink(link: Omit<ContactLinkItem, 'id'>): void {
    const newId = 'link-' + Date.now();
    const newLink: ContactLinkItem = {
      ...link,
      id: newId,
      order: link.order ?? (this.contactLinksSignal().length + 1)
    };
    const updated = [...this.contactLinksSignal(), newLink];
    this.contactLinksSignal.set(updated);
    this.saveStorage(this.CONTACT_LINKS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  updateContactLink(updatedLink: ContactLinkItem): void {
    const updated = this.contactLinksSignal().map(l =>
      l.id === updatedLink.id ? updatedLink : l
    );
    this.contactLinksSignal.set(updated);
    this.saveStorage(this.CONTACT_LINKS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  deleteContactLink(id: string): void {
    const updated = this.contactLinksSignal().filter(l => l.id !== id);
    this.contactLinksSignal.set(updated);
    this.saveStorage(this.CONTACT_LINKS_KEY, updated);
    this._lastLocalWriteAt = Date.now();
    this.syncToCloud();
  }

  /**
   * Updates the primary email across AboutInfo and ContactLinks simultaneously
   */
  updatePrimaryEmail(newEmail: string, triggerSync: boolean = true): void {
    const cleanEmail = newEmail.trim();
    if (!cleanEmail) return;

    // 1. Update AboutInfo
    const currentAbout = this.aboutInfoSignal();
    if (currentAbout.email !== cleanEmail) {
      const updatedAbout = { ...currentAbout, email: cleanEmail };
      this.aboutInfoSignal.set(updatedAbout);
      this.saveStorage(this.ABOUT_KEY, updatedAbout);
    }

    // 2. Update Contact Links
    const updatedLinks = this.contactLinksSignal().map(link => {
      if (link.type === 'email' || link.id === 'email-primary' || link.icon === 'email') {
        return {
          ...link,
          subtitle: cleanEmail,
          url: `mailto:${cleanEmail}`
        };
      }
      return link;
    });

    this.contactLinksSignal.set(updatedLinks);
    this.saveStorage(this.CONTACT_LINKS_KEY, updatedLinks);

    if (triggerSync) {
      this.syncToCloud();
    }
  }

  // --- Contact Messages Methods ---
  getContactMessages(): ContactMessage[] {
    return this.contactMsgsSignal();
  }

  addContactMessage(msg: ContactMessage): void {
    const updated = [msg, ...this.contactMsgsSignal()];
    this.contactMsgsSignal.set(updated);
    this.saveStorage(this.CONTACT_MSGS_KEY, updated);
    this.syncToCloud();
  }

  deleteContactMessage(index: number): void {
    const updated = this.contactMsgsSignal().filter((_, i) => i !== index);
    this.contactMsgsSignal.set(updated);
    this.saveStorage(this.CONTACT_MSGS_KEY, updated);
    this.syncToCloud();
  }

  getSocialLinks(): SocialLink[] {
    const links = this.contactLinksSignal();
    const about = this.aboutInfoSignal();

    if (links && links.length > 0) {
      return links
        .filter(l => l.type === 'url' || l.type === 'email')
        .map(l => ({
          platform: l.title,
          url: l.url,
          icon: l.icon
        }));
    }

    return [
      { platform: 'GitHub', url: about.githubUrl || 'https://github.com/StevenPiedra-dev', icon: 'github' },
      { platform: 'LinkedIn', url: about.linkedinUrl || 'https://www.linkedin.com/in/stevenpiedra/', icon: 'linkedin' },
      { platform: 'Email', url: `mailto:${about.email || 'steven.piedra02@gmail.com'}`, icon: 'email' }
    ];
  }
}
