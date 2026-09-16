import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, debounceTime } from 'rxjs/operators';
import { PortfolioData } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class CloudSyncService {
  private http = inject(HttpClient);

  // Default cloud database endpoint (Firebase Realtime Database REST API)
  private readonly DEFAULT_CLOUD_URL = 'https://steven-piedra-portfolio-default-rtdb.firebaseio.com/portfolio_data.json';
  private readonly STORAGE_CONFIG_KEY = 'portfolio_cloud_sync_config_v5';

  // State signals
  syncStatus = signal<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  lastSyncTime = signal<Date | null>(new Date());
  cloudEndpoint = signal<string>(this.loadCloudEndpoint());
  isAutoSyncEnabled = signal<boolean>(true);

  private saveSubject = new Subject<PortfolioData>();

  constructor() {
    // Debounce cloud write operations (500ms) to avoid request flooding
    this.saveSubject.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.executeCloudSave(data);
    });

    // Listen to network connectivity
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.syncStatus.set('synced'));
      window.addEventListener('offline', () => this.syncStatus.set('offline'));
    }
  }

  private loadCloudEndpoint(): string {
    try {
      const saved = localStorage.getItem(this.STORAGE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.endpoint && !parsed.endpoint.includes('portfolio-steven-default-rtdb')) {
          return parsed.endpoint;
        }
      }
    } catch {}
    return this.DEFAULT_CLOUD_URL;
  }

  setCloudEndpoint(url: string): void {
    this.cloudEndpoint.set(url.trim());
    try {
      localStorage.setItem(this.STORAGE_CONFIG_KEY, JSON.stringify({ endpoint: url.trim() }));
    } catch {}
  }

  resetCloudEndpoint(): void {
    this.setCloudEndpoint(this.DEFAULT_CLOUD_URL);
  }

  /**
   * Fetches latest portfolio data from the cloud
   */
  fetchFromCloud(): Observable<PortfolioData | null> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.syncStatus.set('offline');
      return of(null);
    }

    this.syncStatus.set('syncing');
    const endpoint = this.cloudEndpoint();

    return this.http.get<PortfolioData>(endpoint).pipe(
      map(data => {
        if (data && typeof data === 'object') {
          this.syncStatus.set('synced');
          this.lastSyncTime.set(new Date());
          return data;
        }
        this.syncStatus.set('synced');
        return null;
      }),
      catchError(err => {
        console.warn('Cloud fetch warning (using local cache):', err.message || err);
        this.syncStatus.set('offline');
        return of(null);
      })
    );
  }

  /**
   * Queues an automatic cloud save
   */
  queueSave(data: PortfolioData): void {
    if (!this.isAutoSyncEnabled()) return;
    this.syncStatus.set('syncing');
    this.saveSubject.next(data);
  }

  /**
   * Directly executes cloud save
   */
  executeCloudSave(data: PortfolioData): Observable<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.syncStatus.set('offline');
      return of(false);
    }

    this.syncStatus.set('syncing');
    const endpoint = this.cloudEndpoint();
    const payload = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };

    return this.http.put(endpoint, payload).pipe(
      map(() => {
        this.syncStatus.set('synced');
        this.lastSyncTime.set(new Date());
        return true;
      }),
      catchError(err => {
        console.warn('Cloud save warning (saved locally):', err.message || err);
        this.syncStatus.set('error');
        return of(false);
      })
    );
  }
}
