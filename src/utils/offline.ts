// Offline utility functions for Project Kisan

export interface CachedData {
  timestamp: number;
  data: any;
  expiry?: number; // in milliseconds
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  market: string;
  date: string;
}

export interface CachedFAQ {
  question: string;
  answer: string;
  category: string;
  language: string;
}

// IndexedDB wrapper for structured data
class OfflineDB {
  private dbName = 'kisanApp';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores
        if (!db.objectStoreNames.contains('prices')) {
          db.createObjectStore('prices', { keyPath: 'crop' });
        }
        
        if (!db.objectStoreNames.contains('diagnoses')) {
          db.createObjectStore('diagnoses', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('faqs')) {
          db.createObjectStore('faqs', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async setData(store: string, key: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put({ ...data, key, timestamp: Date.now() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getData(store: string, key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAllData(store: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Singleton instance
const offlineDB = new OfflineDB();

// LocalStorage helpers for simple data
export const setLocalData = (key: string, data: any, expiry?: number): void => {
  const item: CachedData = {
    timestamp: Date.now(),
    data,
    expiry: expiry ? Date.now() + expiry : undefined
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalData = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const cached: CachedData = JSON.parse(item);
    
    // Check expiry
    if (cached.expiry && Date.now() > cached.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cached.data;
  } catch {
    return null;
  }
};

// Market prices caching
export const cacheMarketPrices = async (prices: MarketPrice[]): Promise<void> => {
  try {
    await offlineDB.setData('prices', 'latest', { prices, timestamp: Date.now() });
    setLocalData('lastPriceUpdate', Date.now());
  } catch (error) {
    console.error('Failed to cache prices:', error);
    setLocalData('marketPrices', prices, 24 * 60 * 60 * 1000); // 24 hours
  }
};

export const getCachedMarketPrices = async (): Promise<MarketPrice[]> => {
  try {
    const cached = await offlineDB.getData('prices', 'latest');
    if (cached && cached.prices) return cached.prices;
  } catch (error) {
    console.error('Failed to get cached prices from IndexedDB:', error);
  }
  
  // Fallback to localStorage
  return getLocalData('marketPrices') || [];
};

// FAQ caching
export const cacheFAQs = async (faqs: CachedFAQ[]): Promise<void> => {
  try {
    for (const faq of faqs) {
      await offlineDB.setData('faqs', `${faq.category}_${faq.language}`, faq);
    }
  } catch (error) {
    console.error('Failed to cache FAQs:', error);
    setLocalData('cachedFAQs', faqs, 7 * 24 * 60 * 60 * 1000); // 7 days
  }
};

export const getCachedFAQs = async (category?: string, language?: string): Promise<CachedFAQ[]> => {
  try {
    const allFAQs = await offlineDB.getAllData('faqs');
    return allFAQs.filter(faq => 
      (!category || faq.category === category) && 
      (!language || faq.language === language)
    );
  } catch (error) {
    console.error('Failed to get cached FAQs from IndexedDB:', error);
  }
  
  // Fallback to localStorage
  const cached = getLocalData('cachedFAQs') || [];
  return cached.filter((faq: CachedFAQ) => 
    (!category || faq.category === category) && 
    (!language || faq.language === language)
  );
};

// Diagnosis history caching
export const cacheDiagnosis = async (diagnosis: any): Promise<void> => {
  try {
    await offlineDB.setData('diagnoses', diagnosis.id || Date.now().toString(), {
      ...diagnosis,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to cache diagnosis:', error);
    const history = getLocalData('diagnosisHistory') || [];
    history.unshift({ ...diagnosis, timestamp: Date.now() });
    setLocalData('diagnosisHistory', history.slice(0, 50)); // Keep last 50
  }
};

export const getDiagnosisHistory = async (): Promise<any[]> => {
  try {
    const history = await offlineDB.getAllData('diagnoses');
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get diagnosis history from IndexedDB:', error);
  }
  
  return getLocalData('diagnosisHistory') || [];
};

// Network status
export const isOnline = (): boolean => navigator.onLine;

export const onNetworkChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Demo data
export const getDemoMarketPrices = (): MarketPrice[] => [
  { crop: 'tomato', price: 25, unit: 'kg', market: 'Mandya APMC', date: new Date().toISOString() },
  { crop: 'onion', price: 18, unit: 'kg', market: 'Bangalore APMC', date: new Date().toISOString() },
  { crop: 'potato', price: 22, unit: 'kg', market: 'Mysore APMC', date: new Date().toISOString() },
  { crop: 'rice', price: 35, unit: 'kg', market: 'Hassan APMC', date: new Date().toISOString() }
];

export const getDemoDiagnosis = (language: string = 'en') => {
  const diagnoses = {
    en: {
      disease: "Leaf Spot Disease",
      confidence: 87,
      severity: "Medium",
      advice: "Apply copper-based fungicide. Repeat every 7-10 days.",
      remedies: [
        "Remove infected leaves and destroy them",
        "Avoid overhead watering",
        "Ensure good air circulation"
      ]
    },
    hi: {
      disease: "पत्ती धब्बा रोग",
      confidence: 87,
      severity: "मध्यम",
      advice: "कॉपर आधारित फंगीसाइड का छिड़काव करें। 7-10 दिनों में दोहराएं।",
      remedies: [
        "संक्रमित पत्तियों को हटाकर नष्ट करें",
        "ऊपर से पानी देने से बचें",
        "अच्छी हवा का प्रवाह सुनिश्चित करें"
      ]
    },
    kn: {
      disease: "ಎಲೆ ಕಲೆ ರೋಗ",
      confidence: 87,
      severity: "ಮಧ್ಯಮ",
      advice: "ಕಾಪರ್ ಆಧಾರಿತ ಶಿಲೀಂದ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ. ೭-೧೦ ದಿನಗಳಿಗೊಮ್ಮೆ ಪುನರಾವರ್ತಿಸಿ.",
      remedies: [
        "ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ",
        "ಹೆಚ್ಚು ನೀರು ಕೊಡಬೇಡಿ",
        "ಗಾಳಿ ಇರುವಂತೆ ಮಾಡಿ"
      ]
    }
  };
  
  return diagnoses[language as keyof typeof diagnoses] || diagnoses.en;
};