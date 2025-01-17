'use client';

import TransactionStatusChip from '@/app/(light)/dashboard/features/wallet/transaction/transaction-status-chip';
import CardCell from '@/components/card-cell/card-cell';
import { TableCellContainer } from '@/components/containers/table-cell-container/table-cell-container';
import ExternalLink from '@/components/external-link/external-link';
import { DATE_FORMAT } from '@/constants/date';
import routes from '@/constants/routes';
import { transaction } from '@/locale/en/transaction';
import { FinancialTransactionAction } from '@/services/protocol/types';
import dayjs from 'dayjs';

import { Stack, Divider, Card, Typography } from '@mui/material';

import FinancialActionDetail from '../action-detail';

type Props = {
  transactionId: string;
  title: FinancialTransactionAction;
  date: string;
  type: string;
  objectId?: string;
};

export default function TransactionCardInfo({
  title,
  transactionId: id,
  date,
  type,
}: Props) {
  // const { organization } = useOrganization();

  // const dynamicRoute = useMemo(() => {
  //   if (title === FinancialTransactionAction.ProofCreate) {
  //     const obj = {
  //       text: common.actions.view_proof,
  //       url: '',
  //     };
  //     obj.url = !!organization
  //       ? routes.dashboard.org.proof(organization.orgname, objectId)
  //       : routes.dashboard.user.proof(objectId);
  //     return obj;
  //   }
  //   if (title === FinancialTransactionAction.PdaIssuance) {
  //     const obj = {
  //       text: common.actions.view_pda,
  //       url: '',
  //     };
  //     obj.url = !!organization
  //       ? routes.dashboard.org.asset(organization.orgname, objectId)
  //       : routes.dashboard.user.asset(objectId);
  //     return obj;
  //   }
  // }, [title]);
  return (
    <Stack
      component={Card}
      variant="outlined"
      data-testid="transaction__card"
      sx={{
        mb: 3,
      }}
      divider={<Divider sx={{ width: '100%' }} />}
    >
      <TableCellContainer>
        <CardCell label={transaction.detail}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Typography data-testid="transaction__card__title">
              <FinancialActionDetail action={title} />
            </Typography>
            {/* <Button
              size="small"
              sx={{ marginTop: -2 }}
              href={dynamicRoute?.url}
            >
              {dynamicRoute?.text}
            </Button> */}
          </Stack>
        </CardCell>
      </TableCellContainer>
      <TableCellContainer>
        <CardCell label={transaction.transaction_id}>
          <ExternalLink
            href={routes.explorer.transaction(id)}
            text={id}
            size="big"
            id={id}
          />
        </CardCell>
      </TableCellContainer>
      <TableCellContainer>
        <CardCell label={transaction.date}>
          <Typography data-testid="transaction__card__date">
            {date ? dayjs(date).format(DATE_FORMAT) : ''}
          </Typography>
        </CardCell>
      </TableCellContainer>
      <TableCellContainer>
        <CardCell label="Type">
          <TransactionStatusChip status={type as any} />
        </CardCell>
      </TableCellContainer>
    </Stack>
  );
}
