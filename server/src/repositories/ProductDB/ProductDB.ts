import { Database } from "sqlite3";

import { IProductDB } from "./types";
import { Product } from "../../types/types";
import { IFormatService } from "../../services";

export default class ProductDB implements IProductDB {
  readonly #productDB: Database;
  readonly #formatService: IFormatService;

  constructor(dbSource: string, formatService: IFormatService) {
    this.#productDB = new Database(dbSource);
    this.#formatService = formatService;
  }

  async init(): Promise<void> {
    console.log("Generating Database from CSV..");
    this.createTable();

    const products = await this.#formatService
      .csvToProducts()
      .catch((error) => console.log(error));

    if (!products) return;

    this.insertValues(products);
  }

  getProductsBySku(sku: string) {
    return new Promise(async (resolve, reject) => {
      this.#productDB.all(
        `SELECT * FROM products WHERE CatalogEntryCode='${sku}'`,
        (error: any, res: any) => {
          if (error) reject(error);
          resolve(res);
        }
      );
    });
  }

  private createTable() {
    this.#productDB.exec(`
DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products
(
  PriceValueId       INT PRIMARY KEY,
  Created            TEXT,
  Modified           TEXT,
  CatalogEntryCode   TEXT,
  MarketId           TEXT,
  CurrencyCode       TEXT,
  ValidFrom          TEXT,
  ValidUntil         TEXT,
  UnitPrice          REAL
)
`);
  }

  private insertValues(products: Product[]) {
    this.#productDB.serialize(() => {
      this.#productDB.run("BEGIN TRANSACTION");
      const insertStatement = this.#productDB.prepare(
        "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      );
      products.map((product, i) => {
        console.log(
          `Transfering items to Database.. ${i} / ${products.length}`
        );
        insertStatement.run(Object.values(product));
      });
      this.#productDB.run("END");
    });
  }
}
