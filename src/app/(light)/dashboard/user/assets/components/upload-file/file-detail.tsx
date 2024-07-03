import Image from 'next/image';

import { FileType } from '@/components/form/file-picker/types';
import { formatBytes } from '@/utils/bytes';
import { getFileTypeByMimeType, getIconFile } from '@/utils/pda';
import { limitCharsCentered } from '@/utils/string';

import { Stack, Typography, Avatar } from '@mui/material';

type Props = {
  file: FileType;
};

export default function FileDetail({ file }: Props) {
  const fileType = getFileTypeByMimeType(file.file.type);
  const icon = getIconFile(fileType);

  return (
    <Stack direction={'row'}>
      <Avatar
        alt="Avatar"
        variant="rounded"
        sx={{ backgroundColor: 'divider' }}
      >
        <Image src={icon} alt={`${fileType} icon`} width={24} height={24} />
      </Avatar>
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
          sx={{ color: file.error ? '#8D3225' : '' }}
        >
          {formatBytes(file.file.size)}
        </Typography>
      </Stack>
    </Stack>
  );
}
