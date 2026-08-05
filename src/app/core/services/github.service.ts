import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, map } from 'rxjs/operators';
import { GitHubProfile, GitHubRepo, GitHubEvent } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  private username = 'StevenPiedra-dev';
  private baseUrl = `https://api.github.com/users/${this.username}`;

  // Fallback profile if API fails or rate-limited
  private fallbackProfile: GitHubProfile = {
    login: 'StevenPiedra-dev',
    avatar_url: 'https://github.com/StevenPiedra-dev.png',
    html_url: 'https://github.com/StevenPiedra-dev',
    name: 'Steven Piedra Villalta',
    bio: 'Full Stack Developer | AI Developer | Product Manager',
    public_repos: 14,
    followers: 18,
    following: 12,
    created_at: '2022-01-15T00:00:00Z',
    location: 'Costa Rica'
  };

  private fallbackRepos: GitHubRepo[] = [
    {
      id: 1,
      name: 'Professional-portfolio',
      description: 'Modern, high-performance portfolio featuring Angular 17, Signals, and GitHub API integration.',
      html_url: 'https://github.com/StevenPiedra-dev/Professional-portfolio',
      stargazers_count: 5,
      forks_count: 2,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      topics: ['angular', 'portfolio', 'typescript', 'github-api']
    },
    {
      id: 2,
      name: 'AI-Prompt-Studio',
      description: 'Intelligent prompt engineering platform with multi-LLM API connectors and document RAG pipeline.',
      html_url: 'https://github.com/StevenPiedra-dev',
      stargazers_count: 8,
      forks_count: 3,
      language: 'Python',
      updated_at: new Date().toISOString(),
      topics: ['python', 'ai', 'fastapi', 'llm']
    },
    {
      id: 3,
      name: 'Banking-Microservices-Core',
      description: 'Core banking transaction processor built with C# .NET and microservice architecture.',
      html_url: 'https://github.com/StevenPiedra-dev',
      stargazers_count: 12,
      forks_count: 4,
      language: 'C#',
      updated_at: new Date().toISOString(),
      topics: ['csharp', 'dotnet', 'microservices', 'sql']
    },
    {
      id: 4,
      name: 'FullStack-E-Commerce-API',
      description: 'REST API backend for modern e-commerce with JWT auth, payment gateway integration, and Docker.',
      html_url: 'https://github.com/StevenPiedra-dev',
      stargazers_count: 7,
      forks_count: 1,
      language: 'JavaScript',
      updated_at: new Date().toISOString(),
      topics: ['nodejs', 'express', 'mongodb', 'docker']
    }
  ];

  getProfile(): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(this.baseUrl).pipe(
      catchError(() => of(this.fallbackProfile)),
      shareReplay(1)
    );
  }

  getRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.baseUrl}/repos?sort=updated&per_page=10`).pipe(
      catchError(() => of(this.fallbackRepos)),
      shareReplay(1)
    );
  }

  getEvents(): Observable<GitHubEvent[]> {
    return this.http.get<GitHubEvent[]>(`${this.baseUrl}/events?per_page=10`).pipe(
      catchError(() => of([
        {
          id: '1',
          type: 'PushEvent',
          repo: { name: 'StevenPiedra-dev/Professional-portfolio', url: '' },
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: '2',
          type: 'CreateEvent',
          repo: { name: 'StevenPiedra-dev/AI-Prompt-Studio', url: '' },
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: '3',
          type: 'PushEvent',
          repo: { name: 'StevenPiedra-dev/Banking-Microservices-Core', url: '' },
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ])),
      shareReplay(1)
    );
  }
}
