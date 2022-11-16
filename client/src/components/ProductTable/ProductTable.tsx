import {
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";

import { ProductTableProps } from "./types";

const HEADERS = ["Marknad", "Pris", "Valuta", "Start och slut"];

export const ProductTable = ({ products }: ProductTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {HEADERS.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row, i) => (
            <TableRow key={row.PriceValueId + i}>
              <TableCell component="th" scope="row">
                {row.MarketId}
              </TableCell>
              <TableCell component="th" scope="row">
                {Number(row.UnitPrice).toFixed(2)}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.CurrencyCode}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.ValidFrom.replace(":00.0000000", "").trim()} -{" "}
                {(row.ValidUntil ?? "").replace(":00.0000000", "").trim()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
