import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import CreateLink from './CreateLink';
import LinkList from "./LinkList";
import Header from "./Header";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="background">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;