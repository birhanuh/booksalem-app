import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query {
    getAvailableBooks {
      title
      author
      condition
      language
      price
      status
      published_date
      isbn
      categories {
        name
      }
      orders {
        users {
          id
          name
        }
      }
    }
  }
`

const Books = () => {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };

  const { getAvailableBooks } = data;
  console.log("BOOKS: ", getAvailableBooks);
  return (
    <View style={styles.container}>
      {getAvailableBooks.map(book => (
        <>
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: book.converImageUrl }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.name}>
                {book.author.name}
              </Text>
              <Text style={styles.numberOfBooks}>
                {book.numberOfBooks}
              </Text>
            </View>
          </View>
          <View style={styles.bookContainer}>
            <Text style={styles.book}>
              {book.title}
            </Text>
          </View>
        </>
      ))}
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
  authorContainer: {
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
  numberOfBooks: {
    color: 'gray'
  },
  bookContainer: {
    marginTop: 10
  },
  book: {
    fontSize: 16
  }
});

export default Books
