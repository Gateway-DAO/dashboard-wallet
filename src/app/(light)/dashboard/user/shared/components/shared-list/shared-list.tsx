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
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { useQuery } from '@tanstack/react-query';

import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';

import { columns } from './columns';

// TODO: Merge with PDAsList
export default function SharedList() {
  const { data: sessionData, status } = useSession();
  const token = sessionData?.token;
  const router = useRouter();
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
    return [];
  }, [data?.receivedProofs]);

  if (!isLoading && !pdas.length) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', width: '100%', pt: 18 }}
      >
        {shared.empty}
      </Typography>
    );
  }

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
        onRowClick={(params: GridRowParams<PrivateDataAsset>, event) => {
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
    </>
  );
}
