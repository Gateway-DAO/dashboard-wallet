import { PropsWithChildren, } from 'react';

import { CONTAINER_PX } from '@/theme/config/style-tokens';

import { Box } from '@mui/material';
import { Stack } from '@mui/system';

import { MenuItem } from './sidebar/menu';
import Sidebar from './sidebar/sidebar';

type Props = {
  menuItems: Array<MenuItem>;
};

export default function DashboardLayout({
  children,
  menuItems,
}: PropsWithChildren<Props>) {
  return (
    <Stack direction={'row'}>
      <Sidebar menuItems={menuItems} />
      <Box width="100%" sx={{
        px: CONTAINER_PX
      }}>
        {children}
      </Box>
    </Stack>
  );
}