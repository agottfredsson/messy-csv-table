import { Product } from "../../types/types";

export interface IFormatService {
  csvToProducts(): Promise<Product[] | void>;
}
