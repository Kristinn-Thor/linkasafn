const { ApolloServer, PubSub } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const { getUserId } = require('./utils');
const fs = require('fs');
const path = require('path');

const resolvers = {
  Query,
  Mutation,
  Subscription, // Þurfum að útfæra "fields" milli hluta sérstaklega
  Vote,
  Link,
  User
}

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: (req && req.headers.authorization ? getUserId(req) : null)
    };
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => console.info(`Server is runnning in ${url}`));