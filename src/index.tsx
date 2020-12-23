import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hoc'
import { apolloClient } from '../apollo';
import Navigation from './navigation';

import { ThemeProvider } from 'react-native-elements';

import { reactNativeElementTheme } from './theme';

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient as any}>
        <ThemeProvider theme={reactNativeElementTheme}>
          <Navigation />
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}
