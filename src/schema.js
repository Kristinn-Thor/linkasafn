const { gql } = require('apollo-server-express');

const schema = gql`

  type Query {
    info: String!
    feed(type: ID, filter: String, skip: Int, take: Int, orderBy: LinkOrderByInput): Feed!
    link(id: ID!): Link
    users: [User!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
    updateLink(id: ID!, url: String, description: String): Link
    deleteLink(id: ID!): Link
    signup(email: String!, password: String!, name: String!): AuthPayLoad
    login(email: String!, password: String!): AuthPayLoad
    vote(linkId: ID!): Vote
  }

  type Feed {
    id: ID!
    links: [Link!]!
    count: Int!
  }

  type Vote {
    id: ID!
    link: Link!
    user: User!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User!
    createdAt: String!
    votes: [Vote!]!
    votesCount: Int!
  }

  type Subscription {
    newLink: Link
    newVote: Vote
  }

  type AuthPayLoad {
    token: String
    user: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    links: [Link!]!
  }

  input LinkOrderByInput {
    description: Sort
    url: Sort
    createdAt: Sort
    votesCount: Sort
  }

  enum Sort {
    asc
    desc
  }

  `;

module.exports = schema;