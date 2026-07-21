import { Injectable } from '@angular/core';
import { Project, Skill, SocialLink } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  getProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'Plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos y panel de administración.',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
        imageUrl: 'assets/projects/ecommerce.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con autenticación JWT, notificaciones en tiempo real y dashboard analítico.',
        technologies: ['React', 'Express', 'PostgreSQL', 'Socket.io'],
        imageUrl: 'assets/projects/taskmanager.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true
      },
      {
        id: 3,
        title: 'Weather Dashboard',
        description: 'Dashboard meteorológico con visualización de datos geoespaciales, pronósticos a 7 días y alertas personalizables.',
        technologies: ['Vue.js', 'Python', 'FastAPI', 'Chart.js'],
        imageUrl: 'assets/projects/weather.jpg',
        liveUrl: 'https://github.com/StevenPiedra-dev',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: true
      },
      {
        id: 4,
        title: 'API REST Microservices',
        description: 'Arquitectura de microservicios con Docker, orquestada con Kubernetes y monitoreo con Prometheus.',
        technologies: ['Node.js', 'Docker', 'Kubernetes', 'AWS'],
        imageUrl: 'assets/projects/microservices.jpg',
        githubUrl: 'https://github.com/StevenPiedra-dev',
        featured: false
      }
    ];
  }

  getSkills(): Skill[] {
    return [
      // Frontend
      { name: 'Angular', level: 92, category: 'frontend' },
      { name: 'TypeScript', level: 90, category: 'frontend' },
      { name: 'React', level: 82, category: 'frontend' },
      { name: 'HTML5 / CSS3', level: 95, category: 'frontend' },
      { name: 'RxJS', level: 80, category: 'frontend' },
      // Backend
      { name: 'Node.js', level: 88, category: 'backend' },
      { name: 'Python', level: 78, category: 'backend' },
      { name: 'Java Spring', level: 70, category: 'backend' },
      { name: 'REST / GraphQL', level: 85, category: 'backend' },
      // Tools
      { name: 'Git / GitHub', level: 92, category: 'tools' },
      { name: 'Docker', level: 75, category: 'tools' },
      { name: 'Figma', level: 72, category: 'tools' },
      // Cloud
      { name: 'AWS', level: 68, category: 'cloud' },
      { name: 'Firebase', level: 80, category: 'cloud' },
      { name: 'Vercel / Netlify', level: 88, category: 'cloud' }
    ];
  }

  getSocialLinks(): SocialLink[] {
    return [
      { platform: 'GitHub', url: 'https://github.com/StevenPiedra-dev', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/steven-piedra', icon: 'linkedin' },
      { platform: 'Email', url: 'mailto:steven@example.com', icon: 'email' }
    ];
  }
}
