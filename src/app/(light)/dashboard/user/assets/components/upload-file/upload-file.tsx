'use client';

import FilePicker from '@/components/form/file-picker/file-picker';
import ModalHeader from '@/components/modal/modal-header/modal-header';
import ModalRight from '@/components/modal/modal-right/modal-right';

import { Step, useUploadFileState } from './state';
import UploadModalDetail from './steps/detail';
import UploadModalQrCode from './steps/qr-code';
import UploadModalUploadFiles from './steps/upload';

export function UploadFile() {
  const { state, close, setDetails, setError, setQr, setUpload } =
    useUploadFileState();

  return (
    <>
      <FilePicker
        currentUserStorage={1000}
        onError={setError}
        onChange={setDetails}
      />
      <ModalRight
        open={state.step !== Step.Closed}
        onClose={() => {
          if (state.step === Step.Upload) return;
          close();
        }}
      >
        <ModalHeader {...(state.step !== Step.Upload && { onClose: close })} />
        {state.step === Step.Details && (
          <UploadModalDetail
            files={state.files}
            onUpload={() => {
              setQr(state.files);
            }}
          />
        )}
        {state.step === Step.QR && (
          <UploadModalQrCode
            filename={state.files[0].file.name}
            onPrepared={(pda) => {
              setUpload(state.files, pda);
            }}
          />
        )}
        {state.step === Step.Upload && (
          <UploadModalUploadFiles file={state.files[0]} pda={state.pda} />
        )}
      </ModalRight>
      {/* <UploadModal
        isOpen={isOpen}
        toggle={toggle}
        files={files}
        error={error}
        onFileUpload={setOnFileUpload}
      /> */}
    </>
  );
}
