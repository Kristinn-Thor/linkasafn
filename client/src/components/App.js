import React from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import CreateLink from './CreateLink';
import LinkList from "./LinkList";
import Header from "./Header";
import Login from './Login';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../apolloClient';
import '../styles/App.css';

function App() {

  const apolloClient = useApolloClient(); // Búum til nýjan 'client' með okkar eigin útfærslu á useApolloClient

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <div className="background">
            <Switch>
              <Route exact path="/" component={LinkList} />
              <Route exact path="/create" component={CreateLink} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
