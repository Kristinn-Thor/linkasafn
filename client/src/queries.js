import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
 query FeedQuery($type: ID, $orderBy: LinkOrderByInput, $skip: Int, $take: Int){
    feed(type: $type, orderBy: $orderBy, skip: $skip, take:$take) {
      count
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export const FEED_QUERY_TOP = gql`
 query FeedQueryTop($type: ID, $orderBy: LinkOrderByInput, $skip: Int, $take: Int){
    feed(type: $type, orderBy: $orderBy, skip: $skip, take:$take) {
      count
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votesCount
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($type: ID, $filter: String!) {
    feed(type: $type, filter: $filter) {
      id
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;