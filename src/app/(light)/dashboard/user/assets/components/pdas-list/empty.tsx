import Image from 'next/image';

import FileIcon from '@/components/icons/file-icon';
import { pdas as pdasLocales } from '@/locale/en/pda';
import { WIDTH_CENTERED } from '@/theme/config/style-tokens';

import { Stack, Typography } from '@mui/material';

export default function Empty() {
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
          backgroundColor: 'rgba(119, 26, 201, 0.04)',
          borderRadius: 1,
          minHeight: 566,
          justifyContent: 'center',
          alignItems: 'center',
          // Border dashed with spacing
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23771AC980' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`,
        }}
      >
        <FileIcon
          aria-label="File icon"
          sx={{
            width: 144,
            height: 180,
            filter: 'drop-shadow(-10px 10px 0px rgba(199, 188, 212, 0.3))',
          }}
        />
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            textAlign: 'center',
            width: '100%',
            mt: 2.125,
          }}
        >
          {pdasLocales.empty.text}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            width: '100%',
          }}
        >
          {pdasLocales.empty.subtext}
        </Typography>
      </Stack>
    </Stack>
  );
}
