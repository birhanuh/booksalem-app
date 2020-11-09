import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from '../apollo';
import Routes from '../src/routes';

import { ThemeProvider } from 'react-native-elements';

const theme = {
  colors: {
    primary: 'steelblue',
    secondary: 'skyblue',
    divider: 'powderblue'
  }
};

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </ApolloProvider>
  );
}
