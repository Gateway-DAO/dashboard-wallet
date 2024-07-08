'use client';

import ModalHeader from '@/components/modal/modal-header/modal-header';
import ModalRight from '@/components/modal/modal-right/modal-right';
import { PrivateDataAsset } from '@/services/protocol-v3/types';

import { SharePdaChooseUsername } from './share-pda-choose-username';
import SharePdaFormError from './share-pda-form-error';
import SharePdaFormSuccessfully from './share-pda-form-success';
import SharePdaQrCode from './share-pda-qr-code';
import { useSharePdaState } from './state';

type Props = {
  pda: PrivateDataAsset;
};

export default function SharePda({ pda }: Props) {
  const { state, onClose, onQrCode, onSuccess, onError } = useSharePdaState();
  return (
    <ModalRight open={state.status !== 'closed'} onClose={onClose}>
      <ModalHeader onClose={onClose} />
      {state.status === 'open' && (
        <SharePdaChooseUsername onSelectUsername={onQrCode} />
      )}
      {state.status === 'qr-code' && (
        <SharePdaQrCode
          identification={state.identifier!}
          pda={pda}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      {state.status === 'success' && (
        <SharePdaFormSuccessfully proof={state.proof!} />
      )}
      {state.status === 'error' && <SharePdaFormError error={state.error!} />}
    </ModalRight>
  );
}
