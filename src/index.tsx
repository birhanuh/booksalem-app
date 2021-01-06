import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from "react-redux";
import { apolloClient } from '../apollo';
import Navigation from './navigation';

import { ThemeProvider } from 'react-native-elements';

import { reactNativeElementTheme } from './theme';
import store from './store';

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={reactNativeElementTheme}>
        <Provider store={store}>
          <Navigation />
        </Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
