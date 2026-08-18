import { db } from '../db/kyrozdb';
import { v4 as uuidv4 } from 'uuid';

class DataService {
  /**
   * Retrieves data from the network. If the network fails, falls back to IndexedDB getCache.
   * If successful, updates the getCache.
   */
  async get(url: string, headers?: any): Promise<any> {
    try {
      if (!navigator.onLine) {
        throw new Error('Offline');
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update cache
      await db.getCache.put({
        url,
        data,
        updated_at: Date.now()
      });

      return data;
    } catch (error) {
      console.warn(`[DataService] GET ${url} failed, falling back to cache.`, error);
      const cached = await db.getCache.get(url);
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Performs a mutating operation (POST/PUT/DELETE).
   * If offline, queues the operation in IndexedDB syncQueue.
   */
  async mutate(url: string, method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', payload: any, headers?: any): Promise<any> {
    const operation_id = payload?.offline_id || uuidv4();
    const requestPayload = { ...payload, offline_id: operation_id };

    try {
      if (!navigator.onLine) {
        throw new Error('Offline');
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[DataService] ${method} ${url} failed, queuing offline.`, error);
      
      // Queue offline
      await db.syncQueue.add({
        operation_id,
        method,
        url,
        payload: requestPayload,
        created_at: Date.now(),
        status: 'PENDING',
        retry_count: 0
      });

      // Trigger the sync service (which will try when online)
      window.dispatchEvent(new Event('offline-sync-queued'));

      // Return a mocked success response so the UI continues
      return { success: true, offline: true, operation_id };
    }
  }

  post(url: string, payload: any, headers?: any) {
    return this.mutate(url, 'POST', payload, headers);
  }

  put(url: string, payload: any, headers?: any) {
    return this.mutate(url, 'PUT', payload, headers);
  }

  delete(url: string, payload?: any, headers?: any) {
    return this.mutate(url, 'DELETE', payload, headers);
  }
}

export const dataService = new DataService();
