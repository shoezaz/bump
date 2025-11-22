import { useState, useEffect } from 'react';
import { MOCK_WATCHES, MOCK_TRANSFERS, getMockWatchHistory } from '../lib/mockData';

export const useMockWatches = () => {
  const [watches, setWatches] = useState(MOCK_WATCHES);
  const [isLoading, setIsLoading] = useState(false);

  return {
    data: watches,
    isLoading,
    refetch: () => setWatches([...MOCK_WATCHES]),
  };
};

export const useMockWatch = (id: string) => {
  const watch = MOCK_WATCHES.find(w => w.id === id);

  return {
    data: watch,
    isLoading: false,
    refetch: () => {},
  };
};

export const useMockWatchHistory = (watchId: string) => {
  const history = getMockWatchHistory(watchId);

  return {
    data: history,
    isLoading: false,
  };
};

export const useMockTransfers = () => {
  return {
    data: MOCK_TRANSFERS,
    isLoading: false,
  };
};

export const useMockCreateTransfer = () => {
  return {
    mutate: (data: any, options?: any) => {
      setTimeout(() => {
        options?.onSuccess?.({
          data: {
            id: 'mock-transfer-' + Date.now(),
            ...data,
            transferToken: 'TRF-DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'pending',
            expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
          }
        });
      }, 500);
    },
    isPending: false,
  };
};
