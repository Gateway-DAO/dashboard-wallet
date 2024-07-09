'use client';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

import { FileType } from '@/components/form/file-picker/types';
import { PrivateDataAsset } from '@/services/protocol-v3/types';

export enum Step {
  Closed = 'closed',
  Details = 'details',
  QR = 'qr',
  Upload = 'upload',
  Finished = 'finished',
}

type StepState =
  | { step: Step.Closed }
  | { step: Step.Details; files: FileType[] }
  | { step: Step.QR; files: FileType[] }
  | { step: Step.Upload; files: FileType[]; pda: PrivateDataAsset }
  | { step: Step.Finished; files: FileType[]; pda: PrivateDataAsset };

type StepAction =
  | { type: 'CLOSE' }
  | { type: 'SET_DETAILS'; files: FileType[] }
  | { type: 'SET_QR'; files: FileType[] }
  | { type: 'SET_UPLOAD'; files: FileType[]; pda: PrivateDataAsset }
  | { type: 'SET_SUCCESS'; files: FileType[]; pda: PrivateDataAsset };

const stepReducer = (state: StepState, action: StepAction): StepState => {
  switch (action.type) {
    case 'CLOSE':
      return { step: Step.Closed };
    case 'SET_DETAILS':
      return { step: Step.Details, files: action.files };
    case 'SET_QR':
      return { step: Step.QR, files: action.files };
    case 'SET_UPLOAD':
      return { step: Step.Upload, files: action.files, pda: action.pda };
    case 'SET_SUCCESS':
      return { step: Step.Finished, files: action.files, pda: action.pda };
    default:
      return state;
  }
};

const initialState: StepState = { step: Step.Closed };

export const UploadFileContext = createContext<{
  state: StepState;
  close: () => void;
  setDetails: (files: FileType[]) => void;
  setQr: (files: FileType[]) => void;
  setUpload: (files: FileType[], pda: PrivateDataAsset) => void;
  setFinished: (files: FileType[], pda: PrivateDataAsset) => void;
}>({
  state: initialState,
  close: () => {},
  setDetails: () => {},
  setQr: () => {},
  setUpload: () => {},
  setFinished: () => {},
});

export const UploadFileProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(stepReducer, initialState);

  const close = () => dispatch({ type: 'CLOSE' });
  const setDetails = (files: FileType[]) => {
    if (state.step === Step.Upload) return;
    dispatch({ type: 'SET_DETAILS', files });
  };
  const setQr = (files: FileType[]) => dispatch({ type: 'SET_QR', files });
  const setUpload = (files: FileType[], pda: PrivateDataAsset) =>
    dispatch({ type: 'SET_UPLOAD', files, pda });
  const setFinished = (files: FileType[], pda: PrivateDataAsset) =>
    dispatch({ type: 'SET_SUCCESS', files, pda });

  return (
    <UploadFileContext.Provider
      value={{ state, close, setDetails, setQr, setUpload, setFinished }}
    >
      {children}
    </UploadFileContext.Provider>
  );
};

export const useUploadFileState = () => useContext(UploadFileContext);
