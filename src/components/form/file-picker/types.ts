export enum FileError {
  LIMIT_EXCEEDED,
  INSUFFICIENT_STORAGE,
}

export type FileType = {
  file: Blob;
  error?: FileError;
  pending: boolean;
  uploading: boolean;
  done: boolean;
};

export type FileErrorProps = {
  title: string;
  description: string;
};
