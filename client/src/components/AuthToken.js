import { useApolloClient } from '@apollo/client';
import { useCookies } from 'react-cookie';

// Breyta sem heldur utan um nafnið á kökunni sem geymir jwt lykilinn
const TOKEN_NAME = 'auth-token';

// Búum til okkar eigin 'krók' (react-hook) til þess að sækja, vista og eyða aðgangs-lyklinum
// Aðskiljum aðgangskerfið frá kökugeymslunni.
export const useAuthToken = () => {
  // Notum react-cookies pakkann sjá: https://www.npmjs.com/package/react-cookie
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_NAME]);

  // Fall sem vistar aðgangslykilinn með kökunafninu 'auth-token'
  // Setjum flaggið SameSite: strict til þess að koma í veg fyrir CSRF árásir
  // https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
  // Getum einnig bætt við secure: true þ.a. aðeins er hægt að 
  // nota kökuna á öruggari tengingu -> https (virkar þá ekki í þróunarumhverfi)
  const setAuthToken = (token) => setCookie(TOKEN_NAME, token, { SameSite: 'strict' });

  // Fjarlægjum auth-token lykilinn úr kökunum, t.d. þegar við loggum notanda út
  const removeAuthToken = () => removeCookie(TOKEN_NAME);

  return [cookies[TOKEN_NAME], setAuthToken, removeAuthToken];
};

export const useLogout = () => {
  const [, , removeAuthToken] = useAuthToken();

  const apolloClient = useApolloClient(); // apolloClient vísar nú í 'client-inn' sem við bjuggum til í upphafi í App.js

  const logout = async () => {
    removeAuthToken();
    await apolloClient.resetStore();
  };

  return logout;
}