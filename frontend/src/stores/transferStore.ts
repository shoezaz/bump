import { create } from 'zustand';

export interface Transfer {
  id: string;
  watchId: string;
  fromUserId: string;
  toUserId?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  qrToken: string;
  qrExpiresAt: string;
  createdAt: string;
}

interface TransferState {
  activeTransfer: Transfer | null;
  transferHistory: Transfer[];
  setActiveTransfer: (transfer: Transfer | null) => void;
  addToHistory: (transfer: Transfer) => void;
  updateTransferStatus: (id: string, status: Transfer['status']) => void;
  clearActiveTransfer: () => void;
}

export const useTransferStore = create<TransferState>((set) => ({
  activeTransfer: null,
  transferHistory: [],
  setActiveTransfer: (transfer) => set({ activeTransfer: transfer }),
  addToHistory: (transfer) =>
    set((state) => ({
      transferHistory: [transfer, ...state.transferHistory],
    })),
  updateTransferStatus: (id, status) =>
    set((state) => ({
      transferHistory: state.transferHistory.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
      activeTransfer:
        state.activeTransfer?.id === id
          ? { ...state.activeTransfer, status }
          : state.activeTransfer,
    })),
  clearActiveTransfer: () => set({ activeTransfer: null }),
}));
