import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query {
    book(id: "1261034643710775299") {
      title
      description
      status
      author {
        name
        numberOfBooks
      }
    }
  }
`

const Book = () => {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };
  const { title, description, status, author } = data.book;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: book.coverImageUrl }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.name}>
            {author.name}
          </Text>
          <Text style={styles.username}>
            {author.numberOfBooks}
          </Text>
        </View>
      </View>
      <View style={styles.bookContainer}>
        <Text style={styles.book}>
          {book.title}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  details: {
    marginLeft: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  username: {
    color: 'gray'
  },
  bookContainer: {
    marginTop: 10
  },
  book: {
    fontSize: 16
  }
});

export default Book