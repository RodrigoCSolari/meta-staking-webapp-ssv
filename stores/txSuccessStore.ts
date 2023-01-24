import { ReactNode } from "react";
import create from "zustand";

export interface TxSuccess {
  title: string;
  description?: ReactNode;
}

export interface TxSuccessState {
  txSuccess: TxSuccess;
  setTxSuccess: (value: TxSuccess) => void;
}

export const useTxSuccessStore = create<TxSuccessState>((set) => ({
  txSuccess: { title: "" },
  setTxSuccess: (value: TxSuccess) =>
    set((state) => ({ ...state, txSuccess: value })),
}));
