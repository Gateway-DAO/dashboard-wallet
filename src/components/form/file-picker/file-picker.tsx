import { ChangeEvent, forwardRef, Ref } from 'react';

import { pdas as pdasLocales } from '@/locale/en/pda';

import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

import { FileType } from './types';
import { readUploadedFile } from './utils';

type Props = {
  currentUserStorage: number;
  onChange: (files: FileType[]) => void;
};

function FilePickerField(
  { currentUserStorage, onChange }: Props,
  ref: Ref<HTMLInputElement>
) {
  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }
    const selectedFiles = event.target.files;
    try {
      const files = readUploadedFile(selectedFiles, currentUserStorage);
      onChange(files);
    } catch (e: any) {}
    (event.target.value as any) = ''; // enables re-select of the same file
  };

  return (
    <Button
      component="label"
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
    >
      {pdasLocales.upload_file}
      <input
        id={'file'}
        type="file"
        ref={ref}
        name={'file'}
        onChange={onSelectFile}
        style={{ display: 'none' }}
      />
    </Button>
  );
}

const FilePicker = forwardRef(FilePickerField);

export default FilePicker;
