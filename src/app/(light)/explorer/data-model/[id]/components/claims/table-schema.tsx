import { ClaimFieldProps } from '@/utils/get-claim-type';

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

import Row from './row';

type Props = {
  properties: Record<string, ClaimFieldProps>;
};

export default function TableSchema({ properties }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell align="left" sx={{ color: 'text.secondary' }}>
              Field
            </TableCell>
            <TableCell sx={{ color: 'text.secondary' }} align="right">
              Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(properties).map((item) => (
            <Row key={item} id={item} property={properties[item]} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
