export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  stars?: number;
  forks?: number;
}

export type SkillCategory = 'frontend' | 'backend' | 'databases' | 'cloud' | 'tools' | 'methodologies';

export interface Skill {
  name: string;
  level: number; // 0-100
  category: SkillCategory;
  description?: string;
  icon?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactForm extends ContactMessage {
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

export interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics?: string[];
  homepage?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload?: any;
}

export interface MetricCard {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  change?: string;
}
