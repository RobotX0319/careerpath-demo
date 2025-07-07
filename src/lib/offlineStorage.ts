/**
 * Offline Storage Service
 * 
 * Handles IndexedDB operations for offline storage using native APIs
 */

const DB_NAME = 'careerpath_db';
const DB_VERSION = 1;

interface OfflineUser {
  id: string;
  data: any;
  lastUpdated: number;
}

interface OfflineNotification {
  id: string;
  data: any;
  createdAt: number;
  isSynced: boolean;
}

interface PendingAction {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
}

// Initialize the database
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // User store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      
      // Notifications store
      if (!db.objectStoreNames.contains('notifications')) {
        const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
        notificationsStore.createIndex('by-sync-status', 'isSynced');
      }
      
      // Pending actions store
      if (!db.objectStoreNames.contains('pendingActions')) {
        const pendingStore = db.createObjectStore('pendingActions', { keyPath: 'id' });
        pendingStore.createIndex('by-entity', 'entity');
        pendingStore.createIndex('by-timestamp', 'timestamp');
      }
      
      // Career paths store
      if (!db.objectStoreNames.contains('careerPaths')) {
        db.createObjectStore('careerPaths', { keyPath: 'id' });
      }
    };
  });
}

// User methods
export async function saveUserData(userData: any): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    const offlineUser: OfflineUser = {
      id: userData.uid,
      data: userData,
      lastUpdated: Date.now()
    };
    
    await new Promise((resolve, reject) => {
      const request = store.put(offlineUser);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export async function getUserData(userId: string): Promise<any | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    
    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching user data from IndexedDB:', error);
    return null;
  }
}

// Career path data methods
export async function saveCareerPathData(id: string, data: any): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['careerPaths'], 'readwrite');
    const store = transaction.objectStore('careerPaths');
    
    const offlineData = {
      id,
      data,
      lastUpdated: Date.now()
    };
    
    await new Promise((resolve, reject) => {
      const request = store.put(offlineData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving career path data:', error);
  }
}

export async function getCareerPathData(id: string): Promise<any | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['careerPaths'], 'readonly');
    const store = transaction.objectStore('careerPaths');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error fetching career path data for ${id} from IndexedDB:`, error);
    return null;
  }
}

// Add pending action
export async function addPendingAction(action: PendingAction): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    
    await new Promise((resolve, reject) => {
      const request = store.put(action);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error adding pending action:', error);
  }
}

// Get pending actions
export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['pendingActions'], 'readonly');
    const store = transaction.objectStore('pendingActions');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching pending actions from IndexedDB:', error);
    return [];
  }
}

// Clear all pending actions
export async function clearAllPendingActions(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    
    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing pending actions:', error);
  }
}

// Sync data with server when online
export async function syncOfflineData(): Promise<void> {
  if (!navigator.onLine) return;
  
  try {
    const pendingActions = await getPendingActions();
    
    if (pendingActions.length === 0) return;
    
    // Group actions by entity
    const actionsByEntity: Record<string, PendingAction[]> = {};
    
    pendingActions.forEach(action => {
      if (!actionsByEntity[action.entity]) {
        actionsByEntity[action.entity] = [];
      }
      actionsByEntity[action.entity].push(action);
    });
    
    // Process each entity's actions
    for (const [entity, actions] of Object.entries(actionsByEntity)) {
      try {
        // Sort actions by timestamp
        actions.sort((a, b) => a.timestamp - b.timestamp);
        
        // Send batch update to server
        const response = await fetch(`/api/sync/${entity}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ actions })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to sync ${entity}`);
        }
      } catch (error) {
        console.error(`Error syncing ${entity}:`, error);
      }
    }
    
    // Clear processed actions
    await clearAllPendingActions();
    
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
}

// Check online status and attempt sync when back online
export function initOfflineSync(): void {
  // Try to sync when app loads and we're online
  if (navigator.onLine) {
    syncOfflineData();
  }
  
  // Listen for online status changes
  window.addEventListener('online', () => {
    console.log('Back online, syncing data...');
    syncOfflineData();
  });
  
  // Register for background sync if browser supports it
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      window.addEventListener('online', () => {
        // Use messaging instead of sync API which has limited browser support
        registration.active?.postMessage({
          type: 'SYNC_DATA'
        });
      });
    });
  }
}