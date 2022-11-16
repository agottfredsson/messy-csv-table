import { ApolloServer } from "apollo-server-express";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";

import { schema, resolvers } from "./api";
import { ProductDB } from "./repositories";
import { FormatService } from "./services";

const dbSource = "./src/repositories/ProductDB/products.sqlite";

async function startApolloServer(schema: any, resolvers: any) {
  const app = express();
  const formatService = new FormatService();
  const productDB = new ProductDB(dbSource, formatService);

  await productDB.init();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: { productDB },
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(schema, resolvers);
