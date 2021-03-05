import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink
} from '@apollo/client';
import { useAuthToken } from './components/AuthToken';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

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

const cache = new InMemoryCache();

export const useApolloClient = () => {
  // Náum í aðgangslykilinn sem er geymdur í vafraköku
  const [token] = useAuthToken();
  return new ApolloClient({
    link: authMiddleware(token).concat(httpLink),
    cache: cache
  });

};
