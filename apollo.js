import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";
// import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/link-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withClientState } from 'apollo-link-state';

const GRAPHQL_API_URL = 'http://localhost:4000/';

/**
uncomment the code below in case you are using a GraphQL API that requires some form of
authentication. asyncAuthLink will run every time your request is made and use the token
you provide while making the request.
*/

const asyncAuthLink = setContext(async () => {
  const TOKEN = await AsyncStorage.getItem('@kemetsehaftalem/token');

  return {
    headers: {
      Authorization: TOKEN ? `Bearer ${TOKEN}` : '',
    },
  };
});

// Important to pass same cache to both stateLink and apolloClient
const cache = new InMemoryCache()

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      addMeState: (_, { id, name, email, phone, is_admin }, { cache }) => {
        const data = {
          getMeState: {
            __typename: 'users',
            id,
            name,
            email,
            phone,
            is_admin
          },
        };
        cache.writeData({ data });
        return null;
      },
    },
  }
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

export const apolloClient = new ApolloClient({
  cache,
  // link: httpLink,
  link: ApolloLink.from([stateLink, asyncAuthLink, uploadLink]),
});
