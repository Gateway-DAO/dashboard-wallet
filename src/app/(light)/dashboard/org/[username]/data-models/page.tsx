import { Metadata } from 'next';

import { getPrivateApi } from '@/services/protocol/api';
import { OrganizationIdentifierType } from '@/services/protocol/types';

import { Typography } from '@mui/material';

import DataModelsTable from './components/data-models-table';

export const metadata: Metadata = {
  title: 'Created Data Models - Gateway Network',
};

export default async function DashboardOrgDataModelsPage(props: any) {
  const privateApi = await getPrivateApi();
  const pathnameOrg = props.params?.username;

  const requestsData =
    (
      await privateApi.dataModelsByOrg({
        organization: {
          type: OrganizationIdentifierType.GatewayId,
          value: pathnameOrg,
        },
        skip: 0,
        take: 5,
      })
    )?.dataModels ?? [];

  const count = (
    await privateApi.dataModelsByOrgCount({
      organization: {
        type: OrganizationIdentifierType.GatewayId,
        value: pathnameOrg,
      },
    })
  ).dataModelsCount;

  return (
    <>
      {requestsData && requestsData.length > 0 ? (
        <DataModelsTable data={requestsData} totalCount={count} />
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', width: '100%' }}
        >
          No data models yet
        </Typography>
      )}
    </>
  );
}
