import { gql } from "apollo-server-express";

const schema = gql`
  type Product {
    PriceValueId: String
    Created: String
    Modified: String
    CatalogEntryCode: String
    MarketId: String
    CurrencyCode: String
    ValidFrom: String
    ValidUntil: String
    UnitPrice: String
  }

  type Query {
    getProductsBySku(sku: String): [Product]
  }
`;

export default schema;
