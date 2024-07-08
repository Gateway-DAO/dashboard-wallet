'use client';
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

import { IdentifierValueSchema } from '@/schemas/identifier-value';
import { PrivateDataAsset, Proof } from '@/services/protocol-v3/types';

type State = {
  status: 'closed' | 'open' | 'qr-code' | 'success' | 'error';
  identifier?: IdentifierValueSchema;
  pda?: PrivateDataAsset;
  proof?: Proof;
  error?: string;
};

export const initialState: State = {
  status: 'closed',
};

export type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'open' }
  | { type: 'qr-code'; identifier: IdentifierValueSchema }
  | { type: 'success'; proof: Proof }
  | { type: 'error'; error: string };

export function sharePdaState(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { status: 'open' };
    case 'close':
      return { status: 'closed' };
    case 'qr-code':
      return { status: 'qr-code', identifier: action.identifier };
    case 'success':
      return { status: 'success', proof: action.proof };
    case 'error':
      return { status: 'error', error: action.error };
    default:
      return state;
  }
}

export const SharePdaContext = createContext<{
  state: State;
  onOpen: () => void;
  onClose: () => void;
  onQrCode: (identifier: IdentifierValueSchema) => void;
  onSuccess: (proof: Proof) => void;
  onError: (error: string) => void;
}>({
  state: initialState,
  onOpen: () => {},
  onClose: () => {},
  onQrCode: () => {},
  onSuccess: () => {},
  onError: () => {},
});

export function SharePdaProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(sharePdaState, initialState);
  const onOpen = () => dispatch({ type: 'open' });
  const onClose = () => dispatch({ type: 'close' });
  const onQrCode = (identifier: IdentifierValueSchema) =>
    dispatch({ type: 'qr-code', identifier });
  const onSuccess = (proof: Proof) => dispatch({ type: 'success', proof });
  const onError = (error: string) => dispatch({ type: 'error', error });

  return (
    <SharePdaContext.Provider
      value={{ state, onOpen, onClose, onQrCode, onSuccess, onError }}
    >
      {children}
    </SharePdaContext.Provider>
  );
}
export function useSharePdaState() {
  return useContext(SharePdaContext);
}

export type UseSharePdaState = ReturnType<typeof useSharePdaState>;
