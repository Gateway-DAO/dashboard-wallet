import TitleLayout from '@/components/title-layout/title-layout';
import { pdas as pdasLocales } from '@/locale/en/pda';

import { Box } from '@mui/system';

import PDAsList from './components/pdas-list/pdas-list';
import { UploadFile } from './components/upload-file/upload-file';

export default function AssetsPage() {
  return (
    <>
      <TitleLayout title={pdasLocales.my_data_assets} titleId="title-assets">
        <UploadFile />
      </TitleLayout>
      <Box sx={{ pt: 5 }}>
        <PDAsList />
      </Box>
    </>
  );
}
