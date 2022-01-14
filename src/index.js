import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import fbase from './fbase';
import { Global } from '@emotion/react';
import reset from 'components/Reset';

ReactDOM.render(
  <React.StrictMode>
    <Global styles={reset} />
    <App style={{ display: 'flex' }} />
  </React.StrictMode>,
  document.getElementById('root'),
);
