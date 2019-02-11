import React, { Component } from 'react';
import './App.scss';
import Main from '../pages/Main';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Handlers } from '../handlers/handler';

class App extends Component
{

  render()
  {
     return (
        <div className="App">
          <header className="Header">
            <p>
              ניהול החנות שלי
          </p>
          </header>
          <Handlers/>
          <Main />
        </div>
    );
  }
}

export default App;
