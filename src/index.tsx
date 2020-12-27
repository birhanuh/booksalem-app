import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hoc'
import { Provider } from "react-redux";
import { apolloClient } from '../apollo';
import Navigation from './navigation';

import { ThemeProvider } from 'react-native-elements';

import { reactNativeElementTheme } from './theme';
import store from './store';

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient as any}>
        <ThemeProvider theme={reactNativeElementTheme}>
          <Provider store={store}>
            <Navigation />
          </Provider>
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}
