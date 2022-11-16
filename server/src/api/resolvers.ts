import { IProductDB } from "../repositories/ProductDB";

type args = {
  sku: string;
};

type context = {
  productDB: IProductDB;
};

const resolvers = {
  Query: {
    getProductsBySku: async (_: any, { sku }: args, context: context) =>
      await context.productDB
        .getProductsBySku(sku)
        .catch((error) => console.log(error)),
  },
};

export default resolvers;
