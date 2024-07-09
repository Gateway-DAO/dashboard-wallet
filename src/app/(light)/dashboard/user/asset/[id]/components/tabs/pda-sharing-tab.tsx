import GTWAvatar from '@/components/gtw-avatar/gtw-avatar';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { getIdentity } from '@/utils/identity';

import { ChevronRightOutlined } from '@mui/icons-material';
import { Divider, IconButton, Stack, Typography } from '@mui/material';

import { IndividualDetailRow } from './components';

export default function PDASharingTab({ pda }: { pda: PrivateDataAsset }) {
  return (
    <IndividualDetailRow>
      <Stack divider={<Divider />}>
        {pda.proofs.map((proof) => {
          const verifier = getIdentity({
            user: proof.verifier!,
            organization: proof.verifierOrganization,
          });
          return (
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              sx={{ mt: 1, mb: 2 }}
              key={proof.id}
            >
              <Stack direction={'row'}>
                <GTWAvatar
                  name={verifier.username}
                  alt={verifier.username ?? verifier.did}
                  src={verifier.image ?? ''}
                  size={45}
                />
                <Typography
                  variant="body1"
                  fontWeight={400}
                  sx={{ mt: 1, mx: 3 }}
                >
                  {verifier.username ?? verifier.did}
                </Typography>
              </Stack>
              <IconButton>
                <ChevronRightOutlined />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
    </IndividualDetailRow>
  );
}
