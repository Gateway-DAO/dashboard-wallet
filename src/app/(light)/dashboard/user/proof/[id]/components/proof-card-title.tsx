'use client';
import { useState } from 'react';

import GTWAvatar from '@/components/gtw-avatar/gtw-avatar';
import { TooltipUser } from '@/components/tooltip-user/tooltip-user';
import { proof as proofLocale } from '@/locale/en/proof';
import { limitCharsCentered } from '@/utils/string';

import { Stack, Typography, alpha } from '@mui/material';

type Props = {
  proof: any; // TODO: Add type
};

export default function ProofCardTitle({ proof }: Props) {
  const [tooltip, setTooltip] = useState<boolean>(false);
  return (
    <Stack
      sx={{
        borderRadius: 1,
        mb: 3,
        p: 2,
        backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.4),
      }}
      direction={{ xs: 'column', md: 'row' }}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Stack gap={2.5}>
        <Typography variant="caption" color="text.secondary">
          {proofLocale.share.data_shared_with}
        </Typography>
        <Stack
          sx={{
            position: 'relative',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{
              cursor: 'pointer',
              '&:hover': { opacity: 0.7, transition: 'opacity .3s ease' },
            }}
            onClick={() => setTooltip(true)}
          >
            <GTWAvatar
              src={
                'https://1000logos.net/wp-content/uploads/2016/11/Shape-of-the-Chase-logo-500x311.jpg'
              }
              size={56}
              name={proof?.title}
            />
            <Typography variant="h3">{proof?.title}</Typography>
          </Stack>
          {tooltip && (
            <TooltipUser
              name={proof?.title}
              username={proof?.title}
              issuance_date={''}
              onClose={() => setTooltip(false)}
            />
          )}
        </Stack>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        {`ID ${limitCharsCentered(proof?.id, 8)}`}
      </Typography>
      {/* <ExternalLink text={`ID ${limitCharsCentered(proof?.id, 8)}`} href="#" /> */}
    </Stack>
  );
}