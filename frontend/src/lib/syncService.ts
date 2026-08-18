import { db } from '../db/kyrozdb';

class SyncService {
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.sync.bind(this));
      window.addEventListener('offline-sync-queued', this.sync.bind(this));
      
      // Attempt sync on startup
      setTimeout(() => this.sync(), 2000);
      
      // Periodic check every minute just in case
      setInterval(() => this.sync(), 60000);
    }
  }

  async sync() {
    if (this.isSyncing || !navigator.onLine) return;
    this.isSyncing = true;

    try {
      const pendingItems = await db.syncQueue
        .where('status')
        .equals('PENDING')
        .or('status')
        .equals('ERROR')
        .sortBy('created_at');

      if (pendingItems.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`[SyncService] Starting sync for ${pendingItems.length} items...`);

      for (const item of pendingItems) {
        if (!item.id) continue;

        // Mark as syncing
        await db.syncQueue.update(item.id, { status: 'SYNCING' });

        try {
          const token = localStorage.getItem('token');
          const headers: any = {
            'Content-Type': 'application/json'
          };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const response = await fetch(item.url, {
            method: item.method,
            headers,
            body: JSON.stringify(item.payload)
          });

          if (!response.ok) {
            throw new Error(`Sync failed with status ${response.status}`);
          }

          // Success, remove from queue
          await db.syncQueue.delete(item.id);
          console.log(`[SyncService] Synced operation ${item.operation_id}`);
          
          // Notify UI that a sync completed
          window.dispatchEvent(new Event('offline-sync-completed'));

        } catch (error) {
          console.error(`[SyncService] Failed to sync item ${item.operation_id}:`, error);
          
          // Exponential backoff logic could be added here. For now, mark as ERROR and increment retry.
          await db.syncQueue.update(item.id, { 
            status: 'ERROR',
            retry_count: item.retry_count + 1
          });
          
          // Stop syncing rest of queue to preserve order if network is still down
          if (!navigator.onLine) break; 
        }
      }
    } catch (error) {
      console.error('[SyncService] Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }
  
  async getQueueCount() {
    return await db.syncQueue.count();
  }
}

export const syncService = new SyncService();
