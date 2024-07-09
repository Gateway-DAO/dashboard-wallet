'use client';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useCallback, useRef, useState } from 'react';

import GtwQRCode from '@/components/gtw-qr/gtw-qr-code';
import GtwQrCodeContainer from '@/components/gtw-qr/gtw-qr-code-container';
import LoadingQRCode from '@/components/gtw-qr/loading-qr-code';
import routes from '@/constants/routes';
import { CryptoService } from '@/services/crypto/crypto';
import { AppKeys, LoginSessionV3 } from '@/types/user';
import { useMediaQuery } from '@react-hookz/web';
import { useMutation } from '@tanstack/react-query';
import { Bytes } from 'node-forge';
import { Socket, io } from 'socket.io-client';

import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';

export default function LoginQrCode() {
  const socketRef = useRef<Socket | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | undefined>();
  const keysRef = useRef<{ key: Bytes; iv: Bytes } | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const isDesktop = useMediaQuery(
    theme.breakpoints.up('md').replace('@media ', ''),
    {
      initializeWithValue: false,
    }
  );

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginSessionV3) => {
      try {
        const res = await signIn('credential-jwt', {
          ...data,
          redirect: false,
        });

        if (!res) {
          throw new Error("Couldn't login");
        }

        if (res.error) {
          throw res.error;
        }

        const session = await getSession();

        if (!session) {
          throw new Error('Error during login, please contact Gateway');
        }

        router.push(routes.dashboard.user.myAssets);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  });

  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_BFF_API_SERVER}user`, {
      extraHeaders: {
        'connection-type': 'login',
      },
    });

    socketRef.current.on('connect', async () => {
      console.log(`[socket] connected`);
      const sessionId = socketRef.current!.id;

      const key = CryptoService.generateKey();
      const iv = CryptoService.generateIV();

      keysRef.current = { key, iv };

      setQrCodeData(
        JSON.stringify({
          type: 'login',
          sessionId,
          key: CryptoService.bytesToString(key),
          iv: CryptoService.bytesToString(iv),
        })
      );
    });

    socketRef.current.on(
      'login',
      async (event: { token: string; encryptedData: string }) => {
        console.log(`[socket] login`, event);
        if (!keysRef.current) {
          throw new Error('Keys not generated');
        }

        const decryptedData = CryptoService.decryptStringToBase64(
          event.encryptedData,
          keysRef.current.key,
          keysRef.current.iv
        );

        if (!decryptedData) {
          throw new Error('Decryption failed');
        }

        const keysObject = CryptoService.base64ToObject<AppKeys>(decryptedData);

        if (
          !keysObject ||
          !keysObject.privateKey ||
          !keysObject.signingPrivateKey
        ) {
          throw new Error('Decryption failed');
        }

        login.mutate({ token: event.token, ...keysObject });
      }
    );

    socketRef.current.on('disconnect', () => {
      console.log(`[socket] disconnected`);
      setQrCodeData(undefined);
    });
  }, []);

  useEffect(() => {
    if (isDesktop) {
      initializeSocket();
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [isDesktop, initializeSocket]);

  const onTryAgain = () => {
    login.reset();
    initializeSocket();
  };

  return (
    <>
      <GtwQrCodeContainer>
        {qrCodeData ? <GtwQRCode value={qrCodeData} /> : <LoadingQRCode />}
      </GtwQrCodeContainer>
      <Dialog
        open={login.isLoading || login.isSuccess || login.isError}
        fullWidth
        maxWidth="xs"
      >
        {login.isLoading && (
          <>
            <DialogTitle>
              <CircularProgress color="primary" size={18} /> Logging in...
            </DialogTitle>
            <Typography variant="body2" px={3} pb={3} pt={1}>
              Getting your session ready
            </Typography>
          </>
        )}
        {login.isSuccess && (
          <>
            <DialogTitle>
              <CheckCircle color="success" fontSize="small" /> Logged in
            </DialogTitle>
            <Typography variant="body2" px={3} pb={3} pt={1}>
              You'll enter shortly
            </Typography>
          </>
        )}
        {login.isError && (
          <>
            <DialogTitle>
              <ErrorIcon color="error" fontSize="small" /> Error
            </DialogTitle>
            <Typography variant="body2" px={3} pb={3} pt={1}>
              {(login.error as Error)?.message || 'An error occurred'}
            </Typography>
            <Button
              onClick={onTryAgain}
              variant="contained"
              sx={{ mt: 1, mx: 2, mb: 2, alignSelf: 'flex-start' }}
            >
              Try again
            </Button>
          </>
        )}
      </Dialog>
    </>
  );
}
