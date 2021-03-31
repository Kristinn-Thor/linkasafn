const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const { getUserId } = require('./utils');
const schema = require('./schema.js');

const resolvers = {
  Query,
  Mutation,
  Subscription, // Þurfum að útfæra "fields" milli hluta sérstaklega
  Vote,
  Link,
  User
}

const prisma = new PrismaClient();

const server = new ApolloServer({
  subscriptions: {
    path: '/subscriptions'
  },
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: (req && req.headers.authorization ? getUserId(req) : null)
    };
  }
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: process.env.PORT || 4000 }, () => console.log('Now browse to http://localhost:4000' + server.graphqlPath));
