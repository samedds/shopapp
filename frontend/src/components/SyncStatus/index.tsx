import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, AlertCircle, WifiOff, RefreshCw, X } from 'lucide-react';

interface SyncStats {
  synced: number;
  pending: number;
  failed: number;
  lastSync: Date | null;
}

export function SyncStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState<SyncStats>({
    synced: 0,
    pending: 0,
    failed: 0,
    lastSync: null
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming online
      if (stats.pending > 0) {
        performSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status check
    updateStats();

    // Auto-sync every 30 seconds when online
    const interval = setInterval(() => {
      if (isOnline && stats.pending > 0) {
        performSync();
      }
      updateStats();
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, stats.pending]);

  const updateStats = () => {
    // Get sync stats from localStorage
    const pendingSyncs = JSON.parse(localStorage.getItem('pending_syncs') || '[]');
    const lastSyncTime = localStorage.getItem('last_sync_time');
    
    setStats({
      synced: 0, // We don't track this in localStorage
      pending: pendingSyncs.length,
      failed: 0, // We don't track failures in localStorage
      lastSync: lastSyncTime ? new Date(lastSyncTime) : null
    });
  };

  const performSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear pending syncs (in real app, this would sync to server)
      localStorage.setItem('pending_syncs', '[]');
      localStorage.setItem('last_sync_time', new Date().toISOString());
      
      updateStats();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
    if (isSyncing) {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (stats.pending > 0) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (stats.pending > 0) return `${stats.pending} Pending`;
    return 'Auto-Sync';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (isSyncing) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (stats.pending > 0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-2 ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="hidden sm:inline">{getStatusText()}</span>
          {stats.pending > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {stats.pending}
            </span>
          )}
        </Button>
      </div>

      {/* Sync Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Sync Status
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">Status</span>
                </div>
                <span className={`font-medium ${getStatusColor().split(' ')[0]}`}>
                  {getStatusText()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.pending === 0 ? 'All' : '0'}
                  </p>
                  <p className="text-sm text-gray-600">Synced</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Last Sync: {stats.lastSync ? stats.lastSync.toLocaleString() : 'Never'}
                </p>
              </div>

              {/* Auto-sync info */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-emerald-600">
                  Auto-sync is {isOnline ? 'active' : 'paused'}. Changes sync automatically every 30 seconds.
                </span>
              </div>

              <div className="flex gap-2">
                {stats.pending > 0 && !isSyncing && (
                  <Button 
                    onClick={performSync} 
                    disabled={!isOnline}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Close
                </Button>
              </div>

              {!isOnline && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    You're currently offline. Changes will be synced automatically when you reconnect.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}