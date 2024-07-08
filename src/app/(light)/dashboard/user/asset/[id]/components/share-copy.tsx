'use client';

import SharePda from '@/app/(light)/dashboard/components/share-pda-modal/share-pda-modal';
import { useSharePdaState } from '@/app/(light)/dashboard/components/share-pda-modal/state';
import { common } from '@/locale/en/common';
import { PrivateDataAsset } from '@/services/protocol-v3/types';

import { Button } from '@mui/material';

type Props = {
  pda: PrivateDataAsset;
};

export default function ShareCopy({ pda }: Props) {
  const sharePDAState = useSharePdaState();

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={sharePDAState.onOpen}
        id="share-a-copy"
      >
        {common.actions.share_a_copy}
      </Button>
      <SharePda pda={pda} {...sharePDAState} />
    </>
  );
}
