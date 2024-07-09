import Image from 'next/image';

import { WIDTH_CENTERED } from '@/theme/config/style-tokens';

import { Stack } from '@mui/material';

export default function FileDetail() {
  return (
    <Stack
      sx={{
        maxWidth: {
          xs: WIDTH_CENTERED.maxWidth,
          lg: 'unset',
        },
        mx: {
          xs: 'auto',
          lg: 'unset',
        },
        width: '100%',
      }}
    >
      <Stack
        sx={{
          maxWidth: '100%',
          height: '100%',
          backgroundColor: 'rgba(119, 26, 201, 0.12)',
          borderRadius: 1,
          minHeight: 566,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          width={144}
          height={180}
          src={'/images/file-icon.png'}
          alt={'static-file-icon'}
        />
      </Stack>
    </Stack>
  );
}
