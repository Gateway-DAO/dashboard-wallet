'use client';

import ModalHeader from '@/components/modal/modal-header/modal-header';
import ModalRight from '@/components/modal/modal-right/modal-right';

import { Step, useUploadFileState } from './state';
import UploadModalDetail from './steps/detail';
import UploadModalQrCode from './steps/qr-code';
import UploadModalUploadFiles from './steps/upload';

export default function UploadFileModal() {
  const { state, close, setFinished, setQr, setUpload } = useUploadFileState();
  return (
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
      {(state.step === Step.Upload || state.step === Step.Finished) && (
        <UploadModalUploadFiles
          file={state.files[0]}
          pda={state.pda}
          onFinished={
            state.step === Step.Upload
              ? () => setFinished(state.files, state.pda)
              : undefined
          }
        />
      )}
    </ModalRight>
  );
}
