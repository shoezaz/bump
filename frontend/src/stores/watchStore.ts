import { create } from 'zustand';

export interface Watch {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
  reference?: string;
  year?: number;
  status: 'certified' | 'warning' | 'stolen' | 'modified';
  currentValue?: number;
  imageUrl?: string;
  currentOwnerId: string;
  blockchainHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface WatchState {
  watches: Watch[];
  selectedWatch: Watch | null;
  setWatches: (watches: Watch[]) => void;
  addWatch: (watch: Watch) => void;
  updateWatch: (id: string, watch: Partial<Watch>) => void;
  selectWatch: (watch: Watch | null) => void;
  removeWatch: (id: string) => void;
  reportStolen: (id: string) => void;
}

export const useWatchStore = create<WatchState>((set) => ({
  watches: [],
  selectedWatch: null,
  setWatches: (watches) => set({ watches }),
  addWatch: (watch) => set((state) => ({ watches: [...state.watches, watch] })),
  updateWatch: (id, watchData) =>
    set((state) => ({
      watches: state.watches.map((w) =>
        w.id === id ? { ...w, ...watchData, updatedAt: new Date().toISOString() } : w
      ),
      selectedWatch:
        state.selectedWatch?.id === id
          ? { ...state.selectedWatch, ...watchData, updatedAt: new Date().toISOString() }
          : state.selectedWatch,
    })),
  selectWatch: (watch) => set({ selectedWatch: watch }),
  removeWatch: (id) =>
    set((state) => ({
      watches: state.watches.filter((w) => w.id !== id),
      selectedWatch: state.selectedWatch?.id === id ? null : state.selectedWatch,
    })),
  reportStolen: (id) =>
    set((state) => ({
      watches: state.watches.map((w) =>
        w.id === id
          ? { ...w, status: 'stolen' as const, updatedAt: new Date().toISOString() }
          : w
      ),
    })),
}));
