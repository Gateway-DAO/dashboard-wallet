'use client';
import { Fragment } from 'react';

import { FileType } from '@/components/form/file-picker/types';
import { getFileError } from '@/components/form/file-picker/utils';
import { FILE_SIZE_PRICE } from '@/constants/file-upload';
import { numberToMoneyString } from '@/utils/money';

import {
  Button,
  Stack,
  Typography,
  Box,
  alpha,
  Alert,
  AlertTitle,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';

import FileDetail from '../file-detail';

type Props = {
  files: FileType[];
  onUpload: () => void;
};

export default function UploadModalDetail({ files, onUpload }: Props) {
  const error = files?.[0]?.error ? getFileError(files[0].error) : undefined;
  const fileSizeNumber = files[0]?.file?.size / 1024 / 1024;
  const filePrice = fileSizeNumber * FILE_SIZE_PRICE;
  const price = filePrice >= 0.01 ? filePrice : 0.01;

  return (
    <>
      <Typography variant="h4" mb={3}>
        Upload Summary
      </Typography>
      <Stack direction={'column'} sx={{ mt: 2 }}>
        {files.map((fileInfo) => (
          <Fragment key={fileInfo.file.name}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <FileDetail file={fileInfo} />

              <Typography
                variant="body1"
                fontWeight={400}
                sx={{ color: fileInfo.error ? '#8D3225' : '' }}
              >
                {numberToMoneyString(price)}
              </Typography>
            </Stack>
            {fileInfo.pending ? (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress />
              </Box>
            ) : (
              <></>
            )}
          </Fragment>
        ))}
      </Stack>

      {error && (
        <Alert variant="standard" severity="error" sx={{ mt: 10 }}>
          <AlertTitle>{error.title}</AlertTitle>
          {error.description}
        </Alert>
      )}

      <Stack
        sx={(theme) => ({
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.focusOpacity
          ),
          borderRadius: theme.shape.borderRadius / 16, //Strange issue with MUI
          p: 2,
          textAlign: 'left',
          justifyContent: 'space-between',
          mt: !!error ? 2 : 10,
          gap: 3,
        })}
      >
        <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
          <Typography variant="body1" fontWeight={400} color="text.secondary">
            Total
          </Typography>
          <Stack direction="row" gap={2}>
            <Typography
              fontSize={24}
              sx={{
                textDecoration: 'line-through',
              }}
            >
              {numberToMoneyString(price)}
            </Typography>
            <Tooltip title={'something'} arrow>
              <Chip label={'Free'} color="success" />
            </Tooltip>
          </Stack>
        </Stack>
        <Button
          onClick={onUpload}
          fullWidth
          variant="contained"
          size="small"
          sx={{ mt: 1, height: 56, fontSize: 15 }}
          disabled={!!error}
        >
          Upload
        </Button>
      </Stack>
    </>
  );
}
