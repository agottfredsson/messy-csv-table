import { Product } from "../../types";

export interface IGetStaticProps {
  params: {
    sku: String;
  };
}

export interface SkuProps {
  data: Product[];
}
