const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const awsServerlessExpress = require("aws-serverless-express");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

let cachedServer;
function getServer() {
  if (cachedServer) {
    return cachedServer;
  }

  const app = express();

  const corsOptions = {
    origin: "http://example.com",
    credential: true,
  };

  app.use(cors(corsOptions));

  const server = new ApolloServer({ typeDefs, resolvers });

  server.applyMiddleware({
    app,
  });

  cachedServer = app;
  return cachedServer;
}

exports.handler = async (event, context) => {
  console.log(event);

  try {
    const server = getServer();

    const responseServer = awsServerlessExpress.createServer(
      server,
      undefined,
      ["text/html"]
    );

    console.log("responseServer", responseServer);
    const response = await awsServerlessExpress.proxy(
      responseServer,
      event,
      context,
      "PROMISE"
    ).promise;
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
