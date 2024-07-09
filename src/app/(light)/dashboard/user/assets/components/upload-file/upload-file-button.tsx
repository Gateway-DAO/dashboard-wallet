'use client';

import { useSession } from 'next-auth/react';

import FilePicker from '@/components/form/file-picker/file-picker';

import { useUploadFileState } from './state';

export default function UploadFileButton() {
  const { setDetails } = useUploadFileState();
  const session = useSession();
  const currentUserStorage = session.data?.user.totalFileSize ?? 0;
  return (
    <FilePicker currentUserStorage={currentUserStorage} onChange={setDetails} />
  );
}
