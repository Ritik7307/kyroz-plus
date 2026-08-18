import Dexie, { Table } from 'dexie';

export interface SyncQueueItem {
  id?: number;
  operation_id: string; // UUID
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  payload: any;
  created_at: number;
  status: 'PENDING' | 'SYNCING' | 'ERROR';
  retry_count: number;
}

export interface CachedGetItem {
  url: string; // Used as primary key
  data: any;
  updated_at: number;
}

export class KyrozDB extends Dexie {
  syncQueue!: Table<SyncQueueItem, number>;
  getCache!: Table<CachedGetItem, string>;

  constructor() {
    super('KyrozOfflineDB');
    
    this.version(1).stores({
      syncQueue: '++id, operation_id, status, created_at',
      getCache: 'url, updated_at'
    });
  }
}

export const db = new KyrozDB();
