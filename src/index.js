import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  mixins: {
    toolbar: {
      minHeight: 44,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 44,
      },
      '@media (min-width:600px)': {
        minHeight: 44,
      },
    },
  },
});


ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
