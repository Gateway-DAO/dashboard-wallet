'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';

import { FileType } from '@/components/form/file-picker/types';
import routes from '@/constants/routes';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { UpdateSession } from '@/types/session';
import { useQuery } from '@tanstack/react-query';

import { Check, ErrorOutline, Sync } from '@mui/icons-material';
import { Avatar, Box, Button, LinearProgress, Typography } from '@mui/material';
import { Stack, alpha } from '@mui/system';

import FileDetail from '../file-detail';

type Props = {
  file: FileType;
  pda: PrivateDataAsset;
  onFinished?: () => void;
};

const LoadingIcon = () => (
  <Avatar
    variant="rounded"
    sx={(theme) => ({
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    })}
  >
    <Sync color="primary" />
  </Avatar>
);

const SuccessIcon = () => (
  <Avatar
    variant="rounded"
    sx={(theme) => ({
      backgroundColor: alpha(theme.palette.success.main, 0.08),
    })}
  >
    <Check color="success" />
  </Avatar>
);

const ErrorIcon = () => (
  <Avatar
    variant="rounded"
    sx={(theme) => ({
      backgroundColor: alpha(theme.palette.error.main, 0.08),
    })}
  >
    <ErrorOutline color="error" />
  </Avatar>
);

export default function UploadModalUploadFiles({
  file,
  pda,
  onFinished,
}: Props) {
  const { data: session, update } = useSession();

  const { status, error } = useQuery({
    queryKey: ['upload-file-pda', pda.id, file.file, session?.token],
    queryFn: async () => {
      try {
        const formData = new FormData();
        formData.append('pdaId', pda.id.toString());
        formData.append('file', file.file);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_V3_ENDPOINT}/file/upload`,
          {
            method: 'POST',
            body: formData,
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (!res.ok) {
          console.error(res);
          throw new Error('Failed to upload file');
        }

        const uploadedData: { id: string; url: string; status: string } =
          await res.json();

        await update({
          type: 'pdas',
          pdas: [
            {
              ...pda,
              fileName: file.file.name,
              mimeType: file.file.type,
              size: file.file.size,
              url: uploadedData.url,
              status: uploadedData.status,
              tags: [] as string[],
              proofs: [] as any[],
            },
          ],
        } as UpdateSession);

        return uploadedData;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!session?.token,
  });

  useEffect(() => {
    if (status !== 'loading') {
      onFinished?.();
    }
  }, [status, onFinished]);

  const icon =
    status === 'loading' ? (
      <LoadingIcon />
    ) : status === 'success' ? (
      <SuccessIcon />
    ) : (
      <ErrorIcon />
    );

  return (
    <>
      <Typography variant="h4" mb={3}>
        Uploads
      </Typography>
      <Fragment key={file.file.name}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems="center"
        >
          <FileDetail file={file} icon={icon} />

          {status === 'success' && (
            <Button
              component={Link}
              variant="contained"
              size="small"
              href={routes.dashboard.user.asset(pda.id)}
            >
              View
            </Button>
          )}
        </Stack>
        {status === 'loading' && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress />
          </Box>
        )}
        {status === 'error' && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {(error as any)?.message}
          </Typography>
        )}
      </Fragment>
    </>
  );
}
