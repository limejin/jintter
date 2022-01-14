import React from 'react';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { Global } from '@emotion/react';

import reset from 'components/Reset';

import Profile from 'routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <Global styles={reset} />
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            <Redirect from="*" to="/" />
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
