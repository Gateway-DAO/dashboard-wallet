import { useSession } from 'next-auth/react';
import React from 'react';

import GtwQrCodeContainer from '@/components/gtw-qr/gtw-qr-code-container';
import ModalHeader from '@/components/modal/modal-header/modal-header';
import ModalRight from '@/components/modal/modal-right/modal-right';
import { common_elements } from '@/locale/en/common-elements';

import { Typography } from '@mui/material';

import UpdateQrCode from './update-qr-code';

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export default function UpdateModal({ isOpen, toggleOpen }: Props) {
  const { data } = useSession();
  const hasUpdate = !!data && data.pdas.length !== data.myPDACount;

  if (!hasUpdate) return null;
  return (
    <>
      <ModalRight open={isOpen} onClose={toggleOpen}>
        <ModalHeader onClose={toggleOpen} />
        <Typography variant="h4" mb={1}>
          Scan the QR code to
          <br />
          update data
        </Typography>
        <Typography mb={3}>{common_elements.scan_message}</Typography>
        <GtwQrCodeContainer>
          <UpdateQrCode isOpen={isOpen} onClose={toggleOpen} />
        </GtwQrCodeContainer>
      </ModalRight>
    </>
  );
}
