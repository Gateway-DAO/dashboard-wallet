import { PrivateDataAsset } from '@/services/protocol-v3/types';

export type UpdateSession = {
  type: 'pdas' | 'shared';
  pdas: PrivateDataAsset[];
};
