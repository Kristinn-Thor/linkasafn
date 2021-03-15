import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink
} from '@apollo/client';
import { useAuthToken } from './components/AuthToken';
import { offsetLimitPagination } from "@apollo/client/utilities";

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

  /* ### Kóði sem þurfum ef ætlum að nota subscriptions ### 
     ### í stað polling til þess að sýna breytingar á síðunni  ###
  const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/subscriptions`,
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
  */
  const link = authMiddleware(token).concat(httpLink)

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      /*
        Þurfum að skilgreina "typePolicie" fyrir feed fyrirspurnina
        því við erum að útfæra pagination fyrir linkana sem við fáum frá serverinum.
        Þ.e. við þurfum að skilgreina hvernig við geymum linkana okkar í cache-inu í clientinum 
        sjá docs: https://www.apollographql.com/docs/react/pagination/core-api/
      */
      typePolicies: {
        query: {
          fields: {
            feed: offsetLimitPagination()
          }
        }
      }
    })
  });

};
