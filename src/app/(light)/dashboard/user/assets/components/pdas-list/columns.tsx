'use client';
import Image from 'next/image';

import GTWAvatar from '@/components/gtw-avatar/gtw-avatar';
import DataOutlinedIcon from '@/components/icons/data-outlined';
import { DATE_FORMAT } from '@/constants/date';
import { pdaTableColumnNames } from '@/locale/en/pda';
import { getIdentity } from '@/utils/identity';
import { FileType, getFileTypeByPda, getIconFile } from '@/utils/pda';
import { limitCharsCentered } from '@/utils/string';
import dayjs from 'dayjs';

import { IosShare } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { ListPrivateDataAsset } from './types';

type Actions = {
  onShare: (pda: ListPrivateDataAsset) => void;
};

export const columns = ({
  onShare,
}: Actions): GridColDef<ListPrivateDataAsset>[] => [
  {
    field: 'name',
    headerName: pdaTableColumnNames.name,
    flex: 2,
    renderCell: (params) => {
      let name = '****';
      if (!params.row.new) {
        if (params.row.structured && params.row.dataAsset?.title) {
          name = params.row.dataAsset.title;
        } else if (params.row.fileName) {
          name = params.row.fileName;
        }
      }

      const fileType = getFileTypeByPda(params.row);
      const icon = getIconFile(fileType);

      return (
        <Stack direction={'row'} justifyContent={'space-between'}>
          {fileType === FileType.pda ? (
            <DataOutlinedIcon color="primary" />
          ) : (
            <Image src={icon} alt={`${fileType} icon`} width={24} height={24} />
          )}
          <Typography variant="body1" sx={{ mx: 2 }}>
            {limitCharsCentered(name, 30)}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'uploaded by',
    headerName: pdaTableColumnNames.uploadedBy,
    flex: 1,
    renderCell: (params) => {
      const pda = params.row;

      const issuer = getIdentity({
        organization: pda.organization,
        user: pda.issuer,
      });

      return (
        <Stack direction={'row'} alignItems={'center'}>
          <GTWAvatar
            name={issuer.did}
            alt={issuer.username}
            src={issuer.image}
            size={32}
          />
          <Typography variant="body1" sx={{ mx: 2 }}>
            {issuer.username ?? limitCharsCentered(issuer.did, 10)}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'sharing',
    headerName: pdaTableColumnNames.sharing,
    renderCell: (params) => (
      <Typography variant="body1" fontWeight={700}>
        {params.row.proofs.length || '-'}
      </Typography>
    ),
  },
  {
    field: 'issuanceDate',
    headerName: pdaTableColumnNames.lastModified,
    flex: 1,
    valueFormatter: (params) =>
      params.value ? dayjs(params.value).format(DATE_FORMAT) : '',
  },
  {
    field: 'action',
    type: 'actions',
    // renderCell(params) {
    //   if (params.row.structured || params.row.new) return null;
    //   return renderActionsCell(params);
    // },
    getActions: (params) => [
      <GridActionsCellItem
        key={1}
        label="Share"
        icon={<IosShare />}
        showInMenu
        onClick={() => onShare(params.row)}
      />,
      // <GridActionsCellItem
      //   label="Download"
      //   key={2}
      //   icon={<DownloadIcon />}
      //   showInMenu
      // />,
      // <GridActionsCellItem
      //   key={3}
      //   label="Archive"
      //   icon={<ArchiveIcon />}
      //   showInMenu
      // />,
    ],
  },
];
