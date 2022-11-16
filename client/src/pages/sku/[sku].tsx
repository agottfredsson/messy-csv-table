import { gql } from "@apollo/client";
import { CircularProgress } from "@mui/material";

import client from "../../apollo/apollo-client";
import { ProductTable } from "../../components";
import { formatProductsArray } from "./helpers";
import { IGetStaticProps, SkuProps } from "./types";

export default function Sku({ products }: SkuProps) {
  if (!products)
    return (
      <CircularProgress
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  return <ProductTable products={products} />;
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
  const products = formatProductsArray(data.getProductsBySku);

  return {
    props: {
      products,
    },
  };
}
