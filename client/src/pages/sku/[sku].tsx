import { gql } from "@apollo/client";
import client from "../../apollo-client";
import {
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  CircularProgress,
} from "@mui/material";

import { formatArray, Product } from "./helper";

interface HomeProps {
  data: Product[];
}

export default function Home({ data }: HomeProps) {
  const headers = ["ID", "Marknad", "Pris", "Valuta", "Start och slut"];
  if (!data)
    return (
      <CircularProgress
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  console.log("apa", data[5].ValidUntil);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Produkter">
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell key={i}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={row.PriceValueId + i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.PriceValueId}
              </TableCell>
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
}
export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/sku/sku",
      // Object variant:
      // { params: { sku: 'sku' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { sku } = params;

  const { data } = await client.query({
    query: gql`
      {
        getProductsBySku(sku: "${sku}") {
          PriceValueId
          UnitPrice
          CurrencyCode
          MarketId
          ValidFrom
          ValidUntil
        }
      }
    `,
  });
  const res = formatArray(data.getProductsBySku);

  return {
    props: {
      data: res,
    },
  };
}
