import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const GET_CHECKOUTS = gql`
  query {
    getCheckouts {
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

const Checkouts = () => {
  const { data, loading, error } = useQuery(GET_CHECKOUTS);

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  };

  // const { getCheckouts } = [];
  const getCheckouts = [];
  console.log("CHECKOUTS: ", getCheckouts);
  return (
    <View style={styles.container}>
      {getCheckouts.map(checkout => (
        <>
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: checkout.converImageUrl }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.name}>
                {checkout.author.name}
              </Text>
              <Text style={styles.numberOfCheckouts}>
                {checkout.numberOfCheckouts}
              </Text>
            </View>
          </View>
          <View style={styles.checkoutContainer}>
            <Text style={styles.checkout}>
              {checkout.title}
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
  numberOfCheckouts: {
    color: 'gray'
  },
  checkoutContainer: {
    marginTop: 10
  },
  checkout: {
    fontSize: 16
  }
});

export default Checkouts
