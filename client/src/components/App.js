import React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import CreateLink from './CreateLink';
import LinkList from "./LinkList";
import Header from "./Header";
import Login from './Login';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../apolloClient';
import '../styles/App.css';
import Search from './Search';
import ErrorBoundary from './ErrorBoundary';
import Page404 from './Page404';
import TopLinks from './TopLinks';
import Footer from './Footer';

function App() {

  const apolloClient = useApolloClient(); // Búum til nýjan 'client' með okkar eigin útfærslu á useApolloClient

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="main">
            <ErrorBoundary>
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/new/1" />} />
                <Route exact path="/top" component={TopLinks} />
                <Route exact path="/new/:page" component={LinkList} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/create" component={CreateLink} />
                <Route component={Page404} />
              </Switch>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
