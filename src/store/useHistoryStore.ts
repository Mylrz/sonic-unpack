import { useState } from 'react';
import { HistoryRecord } from '../types/music';

const HISTORY_STORAGE_KEY = 'sonic_unpack_history';

export function useHistoryStore() {
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const addHistoryRecord = (record: HistoryRecord) => {
    setHistory(prev => {
      // Prepend record, limit to 200 items
      const updated = [record, ...prev.filter(r => r.id !== record.id)].slice(0, 200);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to storage:', e);
      }
      return updated;
    });
  };

  const removeHistoryRecord = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const exportHistoryJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `sonic_unpack_history_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return {
    history,
    addHistoryRecord,
    removeHistoryRecord,
    clearHistory,
    exportHistoryJson,
  };
}
