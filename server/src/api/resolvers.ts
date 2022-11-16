type args = {
  sku: string;
};

const resolvers = {
  Query: {
    getProductsBySku: async (_: any, { sku }: args) => {},
  },
};

export default resolvers;
