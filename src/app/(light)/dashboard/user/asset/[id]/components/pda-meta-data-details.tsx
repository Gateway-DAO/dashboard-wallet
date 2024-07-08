import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { CONTAINER_PX } from '@/theme/config/style-tokens';
import { limitCharsCentered } from '@/utils/string';

import { FileDownload } from '@mui/icons-material';
import { Stack, Box, IconButton, Typography } from '@mui/material';

import ShareCopy from './share-copy';
import PDATabs from './tabs/pda-tabs';

type Props = {
  pda: PrivateDataAsset;
  isProofPda?: boolean;
  isOwner: boolean;
};

export default function PDAMetaDataDetails({ pda, isOwner }: Props) {
  return (
    <Stack
      direction={{
        xs: 'column-reverse',
        lg: 'column',
      }}
      gap={5}
    >
      <Stack
        direction="row"
        alignSelf={{
          lg: 'flex-end',
        }}
        width={{
          xs: '100%',
          lg: 'auto',
        }}
        pr={{
          ...CONTAINER_PX,
          xs: 0,
          md: 0,
        }}
        gap={2}
      >
        {isOwner ? (
          <>
            {pda.url && (
              <IconButton
                href={pda.url}
                target="_blank"
                sx={{ backgroundColor: '#00000014' }}
              >
                <FileDownload />
              </IconButton>
            )}

            <ShareCopy pda={pda} />
          </>
        ) : (
          <Box sx={{ height: 40 }} />
        )}
      </Stack>
      <Typography variant="h4" sx={{ px: 4, wordBreak: 'break-all' }}>
        {limitCharsCentered(pda.fileName || pda.dataAsset?.title || '****', 32)}
      </Typography>
      <Box>
        <PDATabs pda={pda} isOwner={isOwner} />
      </Box>
    </Stack>
  );
}
