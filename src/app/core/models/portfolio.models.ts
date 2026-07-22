export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'tools' | 'cloud';
  icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  files?: File[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
