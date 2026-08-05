import { Injectable } from '@angular/core';
import { Project, Skill, SocialLink } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  getProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'Enterprise Banking Core System',
        description: 'Scalable microservices architecture for real-time transaction processing, account management, and financial compliance auditing.',
        technologies: ['Angular', 'C#', '.NET Core', 'SQL Server', 'Azure'],
        imageUrl: 'assets/projects/ecommerce.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true,
        stars: 12,
        forks: 4
      },
      {
        id: 2,
        title: 'AI Smart Assistant & Workflow Automator',
        description: 'Intelligent prompt engineering engine and document processing API leveraging LLMs, vector search, and FastAPI.',
        technologies: ['Python', 'FastAPI', 'React', 'OpenAI API', 'Docker'],
        imageUrl: 'assets/projects/taskmanager.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true,
        stars: 18,
        forks: 6
      },
      {
        id: 3,
        title: 'Real-Time Analytics & Monitoring Dashboard',
        description: 'High-frequency telemetry dashboard visualizing operational metrics, system health, and custom KPIs with sub-second latency.',
        technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets'],
        imageUrl: 'assets/projects/weather.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true,
        stars: 15,
        forks: 3
      },
      {
        id: 4,
        title: 'Microservices Gateway & Cloud Orchestrator',
        description: 'Cloud-native API Gateway with rate limiting, JWT authentication, containerization, and automated CI/CD pipelines.',
        technologies: ['Node.js', 'Docker', 'Firebase', 'Git', 'GCP'],
        imageUrl: 'assets/projects/microservices.jpg',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: false,
        stars: 9,
        forks: 2
      }
    ];
  }

  getSkills(): Skill[] {
    return [
      // Frontend
      { name: 'Angular', level: 80, category: 'frontend', description: 'Standalone components, Signals, RxJS, state management, reactive forms' },
      { name: 'React', level: 70, category: 'frontend', description: 'Hooks, Context API, Redux Toolkit, Next.js integration' },
      { name: 'Next.js', level: 75, category: 'frontend', description: 'App Router, Server Components, SSR/SSG, API Routes' },
      { name: 'TypeScript', level: 85, category: 'frontend', description: 'Strict typing, generics, interfaces, OOP & functional paradigms' },
      { name: 'Tailwind CSS', level: 75, category: 'frontend', description: 'Utility-first styling, custom themes, responsive layouts' },

      // Backend
      { name: 'Python', level: 75, category: 'backend', description: 'Data structures, backend services, script automation, AI pipelines' },
      { name: 'FastAPI', level: 65, category: 'backend', description: 'Async RESTful APIs, Pydantic validation, OpenAPI specs' },
      { name: 'Node.js', level: 60, category: 'backend', description: 'Express framework, REST services, async event loop' },
      { name: 'C# / .NET', level: 60, category: 'backend', description: 'ASP.NET Core, Entity Framework, enterprise backend architectures' },

      // Databases
      { name: 'SQL', level: 70, category: 'databases', description: 'Relational data modeling, complex joins, index optimization' },
      { name: 'PostgreSQL', level: 70, category: 'databases', description: 'Advanced queries, JSONB support, transaction management' },
      { name: 'MongoDB', level: 60, category: 'databases', description: 'NoSQL collections, aggregation framework, schema design' },
      { name: 'Redis', level: 50, category: 'databases', description: 'In-memory key-value cache, pub/sub messaging' },
      { name: 'Firebase', level: 70, category: 'databases', description: 'Firestore NoSQL, real-time database, Authentication, Functions' },

      // Cloud & Tools
      { name: 'Git & GitHub', level: 85, category: 'tools', description: 'Branch management, pull requests, GitHub Actions CI/CD' },
      { name: 'Docker', level: 65, category: 'cloud', description: 'Containerization, Docker Compose, multi-stage builds' },

      // Methodologies & Leadership
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
