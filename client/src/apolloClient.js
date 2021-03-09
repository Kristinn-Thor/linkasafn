import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink
} from '@apollo/client';
import { useAuthToken } from './components/AuthToken';
import { split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Middleware sem setur aðgangslykilinn ef hann er til staðar sem authorization header með hverri fyrirspurn e.request 
// sem við sendum á serverinn í gegnum Apollo client.
const authMiddleware = (token) => new ApolloLink((operation, forward) => {
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation);
});

export const useApolloClient = () => {
  // Náum í aðgangslykilinn sem er geymdur í vafraköku
  const [token] = useAuthToken();

  const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
  });

  const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token
      }
    }
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return (
        kind === 'OperationDefinition' &&
        operation === 'subscription'
      );
    },
    wsLink,
    authMiddleware(token).concat(httpLink)
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

};