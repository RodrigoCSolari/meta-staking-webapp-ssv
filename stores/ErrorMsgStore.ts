import create from "zustand";

interface ErrorMsgState {
  errorMsg: string;
  setErrorMsg: (value: string) => void;
}

export const useErrorMsgStore = create<ErrorMsgState>((set) => ({
  errorMsg: "",
  setErrorMsg: (value: string) =>
    set((state) => ({ ...state, errorMsg: value })),
}));
