import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from '../apollo';
import Routes from '../src/routes';

export default () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Routes />
    </ApolloProvider>
  );
}
