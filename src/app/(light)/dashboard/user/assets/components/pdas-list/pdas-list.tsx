'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { useMemo, useState } from 'react';

import { SharePdaProvider } from '@/app/(light)/dashboard/components/share-pda-modal/state';
import {
  defaultGridConfiguration,
  defaultGridCustomization,
} from '@/components/data-grid/grid-default';
import routes from '@/constants/routes';
import { CryptoService } from '@/services/crypto/crypto';
import { api } from '@/services/protocol-v3/api';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { decryptPda } from '@/utils/pda';
import { useQuery } from '@tanstack/react-query';

import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';

import { columns } from './columns';
import Empty from './empty';
import ShareCopy from './share-copy';

// TODO: Merge with SharedList

export default function PDAsList() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [isShareOpen, toggleOpenShare] = useState<
    PrivateDataAsset | undefined
  >();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  // const [sortModel, setSortModel] = useState<GridSortModel>([
  //   {
  //     field: 'issuanceDate' satisfies keyof PrivateDataAsset,
  //     sort: 'desc',
  //   },
  // ]);

  // const order = useMemo(() => {
  //   if (sortModel?.[0]?.field && sortModel?.[0].sort) {
  //     const key = translatePDAFieldToColumnName(sortModel[0].field);
  //     const value = sortModel[0].sort.toUpperCase();
  //     console.log(key, value);
  //     return {
  //       [key]: value,
  //     };
  //   }
  //   return undefined;
  // }, [sortModel]);

  const token = sessionData?.token;
  const privateKey = sessionData?.privateKey;

  const {
    data: pdas,
    isLoading: isFetchingLatestPdas,
    isSuccess,
  } = useQuery({
    queryKey: [
      'my-pdas',
      token,
      paginationModel.page,
      paginationModel.pageSize,
      // order,
    ],
    async queryFn() {
      if (!token) throw new Error('No token');
      const { myPDAs } = await api(token).pdas({
        skip: paginationModel.page * paginationModel.pageSize,
        take: paginationModel.pageSize,
        // order: order,
      });
      const pem = CryptoService.base64ToPem(privateKey!);
      return Promise.all(
        myPDAs.map((pda) => decryptPda(pda as PrivateDataAsset, pem!))
      );
    },
    enabled: !!token && !!privateKey,
  });

  const renderedColumns = useMemo(
    () => columns({ onShare: toggleOpenShare }),
    [columns]
  );

  const isLoading = status === 'loading' || isFetchingLatestPdas;

  const a = false;

  if (isSuccess && !a) {
    return <Empty />;
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
        rows={pdas ?? []}
        loading={!pdas}
        columns={renderedColumns}
        paginationMode="server"
        onRowClick={(params: GridRowParams<PrivateDataAsset>, event) => {
          // if middle click open new tab
          if (event.button === 1) {
            return window.open(routes.dashboard.user.asset(params.id));
          }
          return router.push(routes.dashboard.user.asset(params.id));
        }}
        pageSizeOptions={[5, 10, 15]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={defaultGridCustomization}
        rowCount={sessionData?.myPDACount ?? 0}
      />
      <SharePdaProvider>
        <ShareCopy pda={isShareOpen} />
      </SharePdaProvider>
    </>
  );
}
