export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl: string;
  images?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  stars?: number;
  category?: string;
  year?: number;
}

export interface TimelineItem {
  id?: number;
  year: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  icon: string;
  type: 'work' | 'education';
}

export interface CertificationItem {
  id?: number;
  icon: string;
  name: string;
  issuer: string;
  year: string;
  level: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface AboutInfo {
  fullName: string;
  roleTitle: string;
  bioParagraph1: string;
  bioParagraph2: string;
  experienceYears: number;
  technologiesCount: number;
  completedProjectsCount: number;
  cvUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  timeline?: TimelineItem[];
  certifications?: CertificationItem[];
  values?: ValueItem[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  readTime: number;
  date: string;
  icon: string;
  featured: boolean;
  gradient: string;
  likes: number;
}

export interface SiteMetrics {
  githubRepos: number;
  totalCommits: number;
  followers: number;
  articlesPublished: number;
  blogViews: number;
  apisBuilt: number;
  techStackMastery: number;
  professionalCerts: number;
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
