'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { useMemo } from 'react';

import {
  defaultGridConfiguration,
  defaultGridCustomization,
} from '@/components/data-grid/grid-default';
import routes from '@/constants/routes';
import { shared } from '@/locale/en/shared';
import { api } from '@/services/protocol-v3/api';
import { useToggle } from '@react-hookz/web';
import { useQuery } from '@tanstack/react-query';

import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';

import UpdateModal from '../../../../components/update-modal/update-modal';
import { ListPrivateDataAsset } from '../../../assets/components/pdas-list/types';
import { columns } from './columns';

// TODO: Merge with PDAsList
export default function SharedList() {
  const { data: sessionData, status } = useSession();
  const token = sessionData?.token;
  const router = useRouter();
  const [isUpdateOpen, toggleOpenUpdate] = useToggle(false);
  const { data, isLoading: isFetchingLatestProofs } = useQuery({
    queryKey: ['proofs', token],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      return api(token).shared();
    },
    enabled: !!token,
    refetchOnWindowFocus: true,
  });

  const isLoading = status === 'loading' || isFetchingLatestProofs;

  const pdas = useMemo(() => {
    console.log(sessionData?.sharedPdas, data?.receivedProofs);

    if (!sessionData?.sharedPdas) return [];
    const newSharedPDAs = data?.receivedProofs.reduce((acc, proof) => {
      const proofPdas = proof.data || [];

      for (const pda of proofPdas) {
        const hasPda = !!sessionData?.sharedPdas.find(
          (initialPda) => initialPda.id === pda.id
        );
        if (hasPda) continue;
        acc.set(pda.id.toString(), {
          ...pda,
          new: true,
        } as ListPrivateDataAsset);
      }
      return acc;
    }, new Map<string, ListPrivateDataAsset>());
    return [
      ...Array.from(newSharedPDAs?.values() || []),
      ...sessionData?.sharedPdas,
    ];
  }, [data?.receivedProofs]);

  return (
    <>
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: {
              xs: 0,
              lg: '300px',
            },
            width: '100%',
          }}
        />
      )}
      <DataGrid
        {...defaultGridConfiguration}
        rows={pdas}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        onRowClick={(params: GridRowParams<ListPrivateDataAsset>, event) => {
          const isUpdate = params.row.new;
          if (isUpdate) {
            return toggleOpenUpdate();
          }
          // if middle click open new tab
          if (event.button === 1) {
            return window.open(routes.dashboard.user.sharedData(params.id));
          }

          return router.push(routes.dashboard.user.sharedData(params.id));
        }}
        pageSizeOptions={[5, 10]}
        sx={{
          ...defaultGridCustomization,
        }}
      />
      {!isLoading && !pdas.length && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', width: '100%' }}
        >
          {shared.empty}
        </Typography>
      )}
      <UpdateModal isOpen={isUpdateOpen} toggleOpen={toggleOpenUpdate} />
    </>
  );
}
