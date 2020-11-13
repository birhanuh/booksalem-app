import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
// import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/link-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GRAPHQL_API_URL = 'http://localhost:4000/';

/**
uncomment the code below in case you are using a GraphQL API that requires some form of
authentication. asyncAuthLink will run every time your request is made and use the token
you provide while making the request.
*/

const asyncAuthLink = setContext(async () => {
  const TOKEN = await AsyncStorage.getItem('@kemetsehaftalem/token');
  console.log("TPLEM_ ", TOKEN)
  return {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
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

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  // link: httpLink,
  link: asyncAuthLink.concat(httpLink),
});
