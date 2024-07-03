import {
  MAX_FILE_UPLOAD_SIZE,
  MAX_FILE_USER_STORAGE,
} from '@/constants/file-upload';

import { FileError } from './types';

export const getFileError = (error?: FileError) => {
  switch (error) {
    case FileError.LIMIT_EXCEEDED:
      return {
        title: 'Limit Excedded',
        description:
          'For now, only files up to 30 MB are allowed to be uploaded.',
      };
    case FileError.INSUFFICIENT_STORAGE:
      return {
        title: 'Insufficient Storage',
        description: `You don't have enough storage to upload.`,
      };
    default:
      return {
        title: 'Unknown Error',
        description: 'An unknown error occurred.',
      };
  }
};

export const readUploadedFile = (
  files: FileList | File[],
  currentUserStorage: number
) => {
  const file = files[0];
  if (file.size > MAX_FILE_UPLOAD_SIZE)
    return [
      {
        file,
        done: false,
        error: FileError.LIMIT_EXCEEDED,
        pending: false,
        uploading: false,
      },
    ];

  if (file.size + currentUserStorage >= MAX_FILE_USER_STORAGE)
    return [
      {
        file,
        done: false,
        error: FileError.INSUFFICIENT_STORAGE,
        pending: false,
        uploading: false,
      },
    ];

  return [
    {
      file,
      done: false,
      pending: false,
      uploading: false,
    },
  ];
};
