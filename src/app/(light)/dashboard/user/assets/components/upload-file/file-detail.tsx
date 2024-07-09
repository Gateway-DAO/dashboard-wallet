import Image from 'next/image';
import { ReactNode } from 'react';

import { FileType } from '@/components/form/file-picker/types';
import { formatBytes } from '@/utils/bytes';
import {
  getBgColorIconFile,
  getFileTypeByMimeType,
  getIconFile,
} from '@/utils/pda';
import { limitCharsCentered } from '@/utils/string';

import { Stack, Typography, Avatar } from '@mui/material';

type Props = {
  file: FileType;
  icon?: ReactNode;
};

export default function FileDetail({ file, icon: overrideIcon }: Props) {
  const fileType = getFileTypeByMimeType(file.file.type);
  const icon = getIconFile(fileType);
  const color = getBgColorIconFile(fileType);

  return (
    <Stack direction={'row'} alignItems={'center'}>
      {overrideIcon || (
        <Avatar alt="Avatar" variant="rounded" sx={{ backgroundColor: color }}>
          <Image src={icon} alt={`${fileType} icon`} width={24} height={24} />
        </Avatar>
      )}
      <Stack direction={'column'} sx={{ mx: 1.5 }}>
        <Typography
          variant="body1"
          fontWeight={400}
          sx={{ color: file.error ? '#8D3225' : '' }}
        >
          {limitCharsCentered(file.file.name, 25)}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ color: file.error ? '#8D3225' : 'text.secondary' }}
        >
          {formatBytes(file.file.size)}
        </Typography>
      </Stack>
    </Stack>
  );
}
