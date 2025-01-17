'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import GtwQRCode from '@/components/gtw-qr/gtw-qr-code';
import GtwQrCodeContainer from '@/components/gtw-qr/gtw-qr-code-container';
import LoadingQRCode from '@/components/gtw-qr/loading-qr-code';
import { common_elements } from '@/locale/en/common-elements';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { Socket, io } from 'socket.io-client';

import { Typography } from '@mui/material';

type Props = {
  filename: string;
  onPrepared: (pda: PrivateDataAsset) => void;
};

export default function UploadModalQrCode({ filename, onPrepared }: Props) {
  const socketRef = useRef<Socket | null>(null);
  const session = useSession();
  const [qrCodeData, setQrCodeData] = useState<string | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_BFF_API_SERVER}user`, {
      extraHeaders: {
        Authorization: `Bearer ${session.data?.token}`,
        'connection-type': 'upload',
      },
    });

    socketRef.current.on('create-pub', () => {
      const sessionId = socketRef.current?.id;
      console.log(`[socket ${sessionId}] connected`);
      setQrCodeData(JSON.stringify({ type: 'upload', sessionId, filename }));
    });

    socketRef.current.on('prepared-upload', async (pda: PrivateDataAsset) => {
      console.log(`[socket] prepared upload`, pda);
      onPrepared(pda);
    });

    socketRef.current.on('disconnect', (e) => {
      console.log(`[socket] disconnected`);
      setQrCodeData(undefined);
    });
  }, []);

  useEffect(() => {
    if (!isMounted || !socketRef.current?.connected) {
      setIsMounted(true);
      initializeSocket();
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isMounted, initializeSocket]);

  return (
    <>
      <Typography variant="h4" mb={1}>
        Scan the QR code to
        <br />
        upload data
      </Typography>
      <Typography mb={3}>{common_elements.scan_message}</Typography>
      <GtwQrCodeContainer>
        {qrCodeData ? <GtwQRCode value={qrCodeData} /> : <LoadingQRCode />}
      </GtwQrCodeContainer>
    </>
  );
}
