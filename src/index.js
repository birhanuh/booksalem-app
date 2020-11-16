import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from '../apollo';
import Navigation from '../src/navigation';

import { ThemeProvider } from 'react-native-elements';

import { reactNativeElementTheme } from './theme';

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={reactNativeElementTheme}>
        <Navigation />
      </ThemeProvider>
    </ApolloProvider>
  );
}
