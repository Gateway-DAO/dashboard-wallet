import { MeQuery } from '@/services/protocol-v3/types';

type UserV3Data = Omit<MeQuery, 'me'> & {
  user: MeQuery['me'];
};

export type AppKeys = {
  signingPrivateKey: string;
  privateKey: string;
};

export type LoginSessionV3 = {
  token: string;
} & AppKeys;

export type SessionV3 = LoginSessionV3 & UserV3Data;
