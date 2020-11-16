import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from '../apollo';
import Navigation from '../src/navigation';

import { ThemeProvider } from 'react-native-elements';

const theme = {
  colors: {
    primary: 'steelblue',
    secondary: 'skyblue',
    white: '#ffffff',
    black: '#242424',
    grey0: '#393e42',
    greyOutline: '#bbb',
    searchBg: '#303337',
    success: '#49BD78',
    error: '#EC3C3E',
    warning: '#F7AA33',
    divider: 'powderblue',
  }
};

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    </ApolloProvider>
  );
}
