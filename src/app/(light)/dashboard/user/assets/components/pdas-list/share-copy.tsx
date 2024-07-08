'use client';

import { useEffect } from 'react';

import SharePda from '@/app/(light)/dashboard/components/share-pda-modal/share-pda-modal';
import { useSharePdaState } from '@/app/(light)/dashboard/components/share-pda-modal/state';
import { PrivateDataAsset } from '@/services/protocol-v3/types';

type Props = {
  pda?: PrivateDataAsset;
};

export default function ShareCopy({ pda }: Props) {
  const { onOpen } = useSharePdaState();

  useEffect(() => {
    if (!pda) {
      onOpen();
    }
  }, [pda, onOpen]);

  if (!pda) return null;

  return <SharePda pda={pda} />;
}
