import { parse } from "csv-parse";
import * as path from "path";
import fs from "fs";

import { Product } from "../../types/types";
import { IFormatService } from "./types";

const filePath = "../../../assets/price_detail.csv";
const headers = [
  "PriceValueId",
  "Created",
  "Modified",
  "CatalogEntryCode",
  "MarketId",
  "CurrencyCode",
  "ValidFrom",
  "ValidUntil",
  "UnitPrice",
];

export default class FormatService implements IFormatService {
  async csvToProducts(): Promise<Product[] | void> {
    return new Promise((resolve, reject) => {
      const csvFilePath = path.resolve(__dirname, filePath);

      const fileContent = fs.readFileSync(csvFilePath);
      parse(
        fileContent,
        {
          delimiter: "\t",
          columns: headers,
          fromLine: 2,
          cast: (columnValue, context) => {
            if (columnValue === "NULL") return null;

            if (context.column === "PriceValueId") return parseInt(columnValue);

            if (context.column === "UnitPrice") return parseFloat(columnValue);

            return columnValue;
          },
        },
        (error, result: Product[]) => {
          if (error) {
            console.log("Error when formatting CSV..", error);
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }
}
