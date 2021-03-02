import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { } from "./styles/App.css";
import App from './components/App';
import { BrowserRouter } from "react-router-dom";

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them

  // Development token
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNDUzNTgzMH0.pnodhMyUq1J6S-9V6EupkhJ4e2Fqu0EshU-dZGcKZ4U"
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
