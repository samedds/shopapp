import { Product, StockMovement, Order, Category } from '../types';
import { productStorage, stockMovementStorage, orderStorage, categoryStorage, syncStorage } from './offlineStorage';

export enum SyncStatus {
  SYNCED = 'synced',
  SYNCING = 'syncing',
  OFFLINE = 'offline',
  ERROR = 'error',
  PENDING = 'pending'
}

class SyncManager {
  private status: SyncStatus = SyncStatus.SYNCED;
  private autoSyncInterval: NodeJS.Timeout | null = null;
  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Check initial status
    this.updateStatus();
  }

  private handleOnline = () => {
    this.setStatus(SyncStatus.SYNCED);
    this.startAutoSync();
  };

  private handleOffline = () => {
    this.setStatus(SyncStatus.OFFLINE);
    this.stopAutoSync();
  };

  private updateStatus = () => {
    if (!navigator.onLine) {
      this.setStatus(SyncStatus.OFFLINE);
    } else {
      const pending = this.getPendingCount();
      if (pending > 0) {
        this.setStatus(SyncStatus.PENDING);
      } else {
        this.setStatus(SyncStatus.SYNCED);
      }
    }
  };

  private setStatus = (newStatus: SyncStatus) => {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.listeners.forEach(listener => listener(newStatus));
    }
  };

  public getStatus = (): SyncStatus => {
    return this.status;
  };

  public addStatusListener = (listener: (status: SyncStatus) => void) => {
    this.listeners.push(listener);
  };

  public removeStatusListener = (listener: (status: SyncStatus) => void) => {
    this.listeners = this.listeners.filter(l => l !== listener);
  };

  public startAutoSync = () => {
    if (navigator.onLine && !this.autoSyncInterval) {
      this.autoSyncInterval = setInterval(() => {
        this.syncAll();
      }, 30000); // Sync every 30 seconds
    }
  };

  public stopAutoSync = () => {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  };

  public getPendingCount = (): number => {
    try {
      const pending = syncStorage.loadPendingSync();
      return pending.length;
    } catch (error) {
      console.error('Error getting pending count:', error);
      return 0;
    }
  };

  public getSyncStats = () => {
    try {
      const pending = syncStorage.loadPendingSync();
      const lastSync = syncStorage.getLastSync();
      
      return {
        synced: 0, // This would come from your backend
        pending: pending.length,
        failed: 0, // This would come from your backend
        lastSync: lastSync ? new Date(lastSync) : null
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return {
        synced: 0,
        pending: 0,
        failed: 0,
        lastSync: null
      };
    }
  };

  public syncAll = async (): Promise<void> => {
    if (!navigator.onLine) {
      this.setStatus(SyncStatus.OFFLINE);
      return;
    }

    this.setStatus(SyncStatus.SYNCING);

    try {
      const pending = syncStorage.loadPendingSync();
      
      if (pending.length === 0) {
        this.setStatus(SyncStatus.SYNCED);
        return;
      }

      // Simulate API calls to sync data
      // In a real app, you would make actual HTTP requests here
      for (const item of pending) {
        await this.syncItem(item);
      }

      // Clear pending sync after successful sync
      syncStorage.clearPendingSync();
      syncStorage.setLastSync(Date.now());
      
      this.setStatus(SyncStatus.SYNCED);
    } catch (error) {
      console.error('Sync failed:', error);
      this.setStatus(SyncStatus.ERROR);
    }
  };

  private syncItem = async (item: any): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real app, you would make actual HTTP requests here
    console.log('Syncing item:', item);
  };

  public addPendingSync = (type: string, action: string, data: any) => {
    syncStorage.addPendingSync(type, action, data);
    this.updateStatus();
  };

  public forceSync = async (): Promise<void> => {
    await this.syncAll();
  };
}

export const syncManager = new SyncManager();