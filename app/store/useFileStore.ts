// /store/useFileStore.ts
import { create } from "zustand";

export interface UploadedFile {
  file_id: string;
  filename: string;
  size: number;
  upload_time: string;
  status: string;
}

type FileState = {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
};

export const useFileStore = create<FileState>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((f) => f.file_id !== fileId),
    })),
  clearFiles: () => set({ files: [] }),
}));
