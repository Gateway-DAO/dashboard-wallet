import { useSession } from 'next-auth/react';
import { Fragment, useEffect } from 'react';

import { FileType } from '@/components/form/file-picker/types';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { numberToMoneyString } from '@/utils/money';
import { useQuery } from '@tanstack/react-query';

import { Box, LinearProgress, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import FileDetail from '../file-detail';

type Props = {
  file: FileType;
  pda: PrivateDataAsset;
};

export default function UploadModalUploadFiles({ file, pda }: Props) {
  const { data: session } = useSession();

  const { status, data, error } = useQuery({
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

        return res.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!session?.token,
  });

  useEffect(() => {
    console.log(status, data, error);
  }, [status, data, error]);

  return (
    <>
      <Typography variant="h4" mb={3}>
        Uploading
      </Typography>
      <Fragment key={file.file.name}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <FileDetail file={file} />

          <Typography
            variant="body1"
            fontWeight={400}
            sx={{ color: file.error ? '#8D3225' : '' }}
          >
            {numberToMoneyString(file.file.size * 0.000001)}
          </Typography>
        </Stack>
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress />
        </Box>
      </Fragment>
    </>
  );
}
