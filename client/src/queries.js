import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
 query FeedQuery($orderBy: LinkOrderByInput, $skip: Int, $take: Int){
    feed(orderBy: $orderBy, skip: $skip, take:$take) {
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

export const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
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