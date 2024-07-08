'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback, useRef, useState } from 'react';

import GtwQRCode from '@/components/gtw-qr/gtw-qr-code';
import GtwQrCodeContainer from '@/components/gtw-qr/gtw-qr-code-container';
import LoadingQRCode from '@/components/gtw-qr/loading-qr-code';
import { common_elements } from '@/locale/en/common-elements';
import { pda as pdaLocale } from '@/locale/en/pda';
import {
  PrivateDataAsset,
  Proof,
  UserIdentificationInput,
} from '@/services/protocol-v3/types';
import { UpdateSession } from '@/types/session';
import { LoginSessionV3 } from '@/types/user';
import { useMediaQuery } from '@react-hookz/web';
import { Socket, io } from 'socket.io-client';
import { PartialDeep } from 'type-fest';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/system';

type Props = {
  identification: UserIdentificationInput;
  pda: PrivateDataAsset;
  onSuccess: (proof: Proof) => void;
  onError: (error: string) => void;
};

export default function ShareCopyQrCode({
  identification,
  pda,
  onError,
  onSuccess,
}: Props) {
  const session = useSession();
  const [qrCodeData, setQrCodeData] = useState<string | undefined>();
  const socketRef = useRef<Socket | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(
    theme.breakpoints.up('md').replace('@media ', ''),
    {
      initializeWithValue: false,
    }
  );

  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_BFF_API_SERVER}user`, {
      extraHeaders: {
        Authorization: `Bearer ${session.data?.token}`,
        'connection-type': 'share',
      },
    });

    socketRef.current.on('create-pub', async () => {
      const sessionId = socketRef.current?.id;

      setQrCodeData(
        JSON.stringify({
          type: 'share',
          sessionId,
          identity: identification,
          pdaId: pda.id,
        })
      );
    });

    socketRef.current.on(
      'shared',
      async ({ pda, proofId }: { pda: PrivateDataAsset; proofId: string }) => {
        console.log(pda);
        if (pda.proofs?.length === 0) {
          onError('Error on receiving shared data');
          return;
        }
        const proof = pda.proofs.find((p) => p.id === proofId);
        if (!proof) {
          onError('Error on receiving shared data');
          return;
        }

        if (
          proof.verifier &&
          session.data &&
          proof.verifier.did === session.data.user.did
        ) {
          session.update({
            type: 'shared',
            pdas: [pda],
          } as UpdateSession);
        }

        proof.data = [pda];

        onSuccess(proof);
      }
    );
  }, []);

  useEffect(() => {
    if (isDesktop) {
      initializeSocket();
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [isDesktop, initializeSocket]);

  return (
    <>
      <Typography component="h2" variant="h4" sx={{ mb: 4 }}>
        {pdaLocale.share.share_a_copy_with}
      </Typography>
      <Typography mb={2}>{common_elements.scan_message}</Typography>
      <GtwQrCodeContainer>
        {qrCodeData ? <GtwQRCode value={qrCodeData} /> : <LoadingQRCode />}
      </GtwQrCodeContainer>
      <p>{qrCodeData}</p>
      <button
        type="button"
        onClick={() => {
          onSuccess({
            verifier: {
              did: 'did:gatewayId:H2RVfDAhudKFczTJgo4aPCCqafelmcIX4W5H:hwrmbGnvFWHEozktwUgfKOfHyHpPhfGk0j3J1GyTOY0Jzgz',
              username: 'testuser',
            },
            data: [
              {
                id: 123213213213,
                dataAsset: {
                  title: 'Abc',
                },
                structured: true,
              } as PartialDeep<PrivateDataAsset>,
              {
                id: 1433,
                fileName: 'test.pdf',
                mimeType: 'application/pdf',
              } as PartialDeep<PrivateDataAsset>,
            ] satisfies PartialDeep<PrivateDataAsset>[] as any,
          } satisfies PartialDeep<Proof> as Proof);
        }}
      >
        onSuccess
      </button>
      <button type="button" onClick={() => onError('error')}>
        onError
      </button>
    </>
  );
}
