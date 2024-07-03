'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import FilePicker from '@/components/form/file-picker/file-picker';
import TitleLayout from '@/components/title-layout/title-layout';
import { pdas as pdasLocales } from '@/locale/en/pda';
import { useToggle } from '@react-hookz/web';

import { Box } from '@mui/system';

import PDAsList from './components/pdas-list/pdas-list';
import UploadModal from './components/upload-modal/upload-modal';

export type FileType = {
  file: Blob;
  error: boolean;
  pending: boolean;
  uploading: boolean;
  done: boolean;
};

export default function AssetsPage() {
  const [isOpen, toggle] = useToggle();
  const [error, setError] = useState({ title: '', description: '' });
  const [files, setOnFileUpload] = useState<FileType[]>([]);

  return (
    <>
      <TitleLayout title={pdasLocales.my_data_assets} titleId="title-assets">
        <FilePicker
          currentUserStorage={1000}
          onError={setError}
          onFileUpload={setOnFileUpload}
          toggle={toggle}
        />
      </TitleLayout>
      <UploadModal
        isOpen={isOpen}
        toggle={toggle}
        files={files}
        error={error}
        onFileUpload={setOnFileUpload}
      />
      <Box sx={{ pt: 5 }}>
        <PDAsList />
      </Box>
    </>
  );
}
