'use client';
import { Fragment } from 'react';

import { FileType } from '@/components/form/file-picker/types';
import { getFileError } from '@/components/form/file-picker/utils';
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
                {numberToMoneyString(fileInfo.file.size * 0.000001)}
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

      <Box
        sx={(theme) => ({
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.focusOpacity
          ),
          borderRadius: theme.shape.borderRadius / 16, //Strange issue with MUI
          p: 2,
          textAlign: 'left',
          mt: !!error ? 2 : 10,
        })}
      >
        <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
          <Typography variant="body1" fontWeight={400}>
            Total
          </Typography>
          <Stack direction="row" gap={1}>
            <Typography
              fontSize={24}
              sx={{
                textDecoration: 'line-through',
              }}
            >
              {numberToMoneyString(files[0]?.file?.size * 0.01)}
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
          sx={{ mt: 1 }}
          disabled={!!error}
        >
          Upload
        </Button>
      </Box>
    </>
  );
}
