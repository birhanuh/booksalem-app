import React from 'react';
import { View, SafeAreaView, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Text, colors } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';

const GET_CHECKOUTS = gql`
  query {
    getAllCheckouts {
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

const AllCheckouts = () => {
  const { data, loading, error } = useQuery(GET_CHECKOUTS);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  };

  // const { getAllCheckouts } = [];
  const getAllCheckouts = [];
  console.log("CHECKOUTS: ", getAllCheckouts);
  return (
    <View style={styles.container}>
      {getAllCheckouts.map(checkout => (
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
              <Text style={styles.numberOfAllCheckouts}>
                {checkout.numberOfAllCheckouts}
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
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
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
  numberOfAllCheckouts: {
    color: 'gray'
  },
  checkoutContainer: {
    marginTop: 10
  },
  checkout: {
    fontSize: 16
  }
});

export default AllCheckouts
