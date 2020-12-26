import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/link-context';
import { createUploadLink } from "apollo-upload-client";
// import { onError } from "@apollo/client/link/error";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const HOST = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2'
const GRAPHQL_API_URL = `http://${HOST}:4000/`;
const GRAPHQL_WS_URL = `ws://${HOST}:4000/`;

/**
uncomment the code below in case you are using a GraphQL API that requires some form of
authentication. asyncAuthLink will run every time your request is made and use the token
you provide while making the request.
*/

const asyncAuthLink: any = setContext(async () => {
  const TOKEN = await AsyncStorage.getItem('@kemetsehaftalem/token');

  return {
    headers: {
      Authorization: TOKEN ? `Bearer ${TOKEN}` : '',
    },
  };
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS_URL,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      authToken: await AsyncStorage.getItem('@kemetsehaftalem/token')
    },
  },
});

// const link = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.map(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

// onError = ({ networkError, graphQLErrors }) => {
//   console.log('graphQLErrors', graphQLErrors)
//   console.log('networkError', networkError)
// }

const uploadLink = new createUploadLink({
  uri: GRAPHQL_API_URL
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getAvailableBooks: {
          // Don't cache separate results based on
          // any of this field's arguments set this to false.
          keyArgs: ["searchString", "typeCode"],
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        }
      }
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  asyncAuthLink.concat(uploadLink),
);

export const apolloClient = new ApolloClient({
  cache,
  // link: uploadLink,
  link: splitLink,
});

