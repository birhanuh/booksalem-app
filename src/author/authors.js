import React from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Card, colors } from 'react-native-elements';
import { useQuery } from '@apollo/client';
import AddAuthor from './addAuthor';
import GET_AUTHORS from './authors.graphql';

const Authors = ({ route, navigation }) => {
  const { data, loading, error } = useQuery(GET_AUTHORS, { fetchPolicy: "network-only" });

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
      <AddAuthor route={route} navigation={navigation} />

      <Card style={styles.card}>
        <Card.Title>Authors</Card.Title>
        <Card.Divider />
        <FlatList
          data={getAuthors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.id}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        />
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

export default Authors