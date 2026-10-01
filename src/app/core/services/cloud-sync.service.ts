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

  /**
   * Write-lock: true while a save is queued or in-flight.
   * When true, fetchFromCloud() returns null so it never overwrites local changes.
   */
  private _writeLock = false;

  private eventSource: EventSource | null = null;

  constructor() {
    // Debounce cloud write operations (250ms) to avoid request flooding during typing
    this.saveSubject.pipe(
      debounceTime(250)
    ).subscribe(data => {
      this._writeLock = true;
      this.executeCloudSave(data).subscribe(() => {
        this._writeLock = false;
      });
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
    const cleanUrl = url.trim() || this.DEFAULT_CLOUD_URL;
    this.cloudEndpoint.set(cleanUrl);
    try {
      localStorage.setItem(this.STORAGE_CONFIG_KEY, JSON.stringify({ endpoint: cleanUrl }));
    } catch {}
  }

  resetCloudEndpoint(): void {
    this.setCloudEndpoint(this.DEFAULT_CLOUD_URL);
  }

  /**
   * Returns true if a save is currently queued or being uploaded.
   */
  get hasPendingSave(): boolean {
    return this._writeLock;
  }

  /**
   * Real-time Server-Sent Events (SSE) listener for Firebase Realtime Database.
   * Enables instantaneous cross-device synchronization in sub-second latency.
   */
  listenToCloudStream(onUpdate: (data: PortfolioData) => void): void {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }

      const streamUrl = this.cloudEndpoint();
      this.eventSource = new EventSource(streamUrl);

      this.eventSource.addEventListener('put', (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed) {
            if (parsed.path === '/' && parsed.data && typeof parsed.data === 'object') {
              onUpdate(parsed.data);
            } else {
              // Node updated (e.g. /projects or /blogPosts), fetch latest state
              this.fetchFromCloud().subscribe(fresh => {
                if (fresh) onUpdate(fresh);
              });
            }
          }
        } catch (e) {
          console.warn('SSE message parse warning:', e);
        }
      });

      this.eventSource.addEventListener('patch', () => {
        this.fetchFromCloud().subscribe(fresh => {
          if (fresh) onUpdate(fresh);
        });
      });

      this.eventSource.onerror = () => {
        // SSE automatically reconnects; fallback polling remains active
      };
    } catch (err) {
      console.warn('Could not establish EventSource stream:', err);
    }
  }

  /**
   * Fetches latest portfolio data from the cloud with cache-busting to bypass browser disk cache.
   * Returns null (no-op) if a write is in-flight to prevent overwriting local edits.
   */
  fetchFromCloud(): Observable<PortfolioData | null> {
    // Guard: never overwrite local data while a save is in progress
    if (this._writeLock) {
      return of(null);
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.syncStatus.set('offline');
      return of(null);
    }

    this.syncStatus.set('syncing');
    const baseEndpoint = this.cloudEndpoint();
    const separator = baseEndpoint.includes('?') ? '&' : '?';
    const endpointWithCacheBuster = `${baseEndpoint}${separator}_nocache=${Date.now()}`;

    return this.http.get<PortfolioData>(endpointWithCacheBuster).pipe(
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
   * Queues an automatic cloud save.
   * @param immediate If true, skips debounce and executes immediately (e.g., delete, add, explicit saves).
   */
  queueSave(data: PortfolioData, immediate = false): void {
    if (!this.isAutoSyncEnabled()) return;
    this._writeLock = true;
    this.syncStatus.set('syncing');

    if (immediate) {
      this.executeCloudSave(data).subscribe(() => {
        this._writeLock = false;
      });
    } else {
      this.saveSubject.next(data);
    }
  }

  /**
   * Directly executes a cloud save (PUT). Returns an Observable — caller must subscribe.
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
