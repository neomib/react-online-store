import React, { Component } from 'react';
import './App.scss';
import Main from '../pages/Main';
import { Handlers } from '../handlers/handler';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Categories from '../components/Categories';

class App extends Component
{

  render()
  {
    return (
      <Router basename="/management" >
        <div className="App">
       <header className="Header">
            <p> ניהול החנות שלי</p>
          </header>
          <Handlers />
          <Route exact path="/" component={Main} />
          <Switch>
            <Route path="/קטגוריות/:categoryId" component={Categories} />
            <Route path="/קטגוריות" component={Categories} />
          </Switch>
        </div>
       
      </Router>
    );
  }
}

export default App;
