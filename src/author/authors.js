import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Divider, ListItem, Card, colors } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import AddAuthor from './addAuthor';

const GET_AUTHORS = gql`
  query {
    getAuthors {
      id
      name
    }
  }
`

const Orders = ({ route }) => {
  const { data, loading, error } = useQuery(GET_AUTHORS);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };

  const { getAuthors } = data;

  return (
    <View style={styles.container}>
      <AddAuthor referrer={route.params.referrer} />

      <Card style={styles.card}>
        <Card.Title>Authors</Card.Title>
        <Card.Divider />
        {
          getAuthors.map((a, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{a.name}</ListItem.Title>
                <ListItem.Subtitle>{a.id}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        }
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  },
  card: {
    shadowColor: colors.divider,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Orders