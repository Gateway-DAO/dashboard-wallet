import TitleLayout from '@/components/title-layout/title-layout';
import { shared } from '@/locale/en/shared';
import { getGtwServerSession } from '@/services/next-auth/get-gtw-server-session';

import { Box } from '@mui/system';

import SharedList from './components/shared-list/shared-list';

export default async function SharedPage() {
  const session = await getGtwServerSession();

  return (
    <>
      <TitleLayout title={shared.title} titleId="title-assets" />

      <Box sx={{ pt: 5 }}>
        <SharedList pdas={session?.sharedPdas ?? []} />
      </Box>
    </>
  );
}
