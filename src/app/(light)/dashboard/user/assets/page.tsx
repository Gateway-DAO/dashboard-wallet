'use client';
import TitleLayout from '@/components/title-layout/title-layout';
import { pdas as pdasLocales } from '@/locale/en/pda';

import { Box } from '@mui/system';

import PDAsList from './components/pdas-list/pdas-list';
import { UploadFileProvider } from './components/upload-file/state';
import UploadFileModal from './components/upload-file/upload-file';
import UploadFileArea from './components/upload-file/upload-file-area';
import UploadFileButton from './components/upload-file/upload-file-button';

export default function AssetsPage() {
  return (
    <UploadFileProvider>
      <UploadFileArea />
      <TitleLayout title={pdasLocales.my_data_assets} titleId="title-assets">
        <UploadFileButton />
      </TitleLayout>
      <Box sx={{ pt: 5 }}>
        <PDAsList />
      </Box>
      <UploadFileModal />
    </UploadFileProvider>
  );
}
