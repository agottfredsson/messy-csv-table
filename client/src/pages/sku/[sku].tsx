import { gql } from "@apollo/client";
import { CircularProgress } from "@mui/material";

import client from "../../apollo-client";
import { ProductTable } from "../../components";
import { formatArray } from "./helpers";
import { IGetStaticProps, SkuProps } from "./types";

export default function Sku({ data }: SkuProps) {
  const headers = ["ID", "Marknad", "Pris", "Valuta", "Start och slut"];

  if (!data)
    return (
      <CircularProgress
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  return <ProductTable headers={headers} products={data} />;
}
export async function getStaticPaths() {
  return {
    paths: ["/sku/sku"],
    fallback: true,
  };
}

export async function getStaticProps({ params }: IGetStaticProps) {
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
