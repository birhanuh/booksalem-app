import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, Button, Text, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';
import navigation from '../navigation';

const GET_BOOK = gql`
  query($id: Int!) {
    getBook(id: $id) {
      book {
        id
        title
        author
        condition
        price
        status
        published_date
        isbn
        cover_url
        description
        rating
      }
    }
  }  
`

const ViewBook = ({ route }) => {
  console.log("HIS: ", route.params.id, route.params.name)
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: route.params.id },
  });

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };

  const { book: { id, title, author, condition, price, status, published_date, isbn, cover_url, description, rating } } = data && data.getBook

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title>{title}</Card.Title>
        <Card.Divider />
        <Card.Image source={{ uri: cover_url }} />
        <View style={styles.bookInfoPriceContainer}>
          <View style={styles.bookInfoContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Author: </Text>{author}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Language: </Text>{language}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Category: </Text>{category}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {price}
            </Text>
            <Text style={styles.text}>
              ETB
            </Text>
          </View>
        </View>
        <Text style={styles.text}>
          Description: {description}
        </Text>

        <Divider style={{ marginTop: 10, marginBottom: 10 }} />

        <Button
          icon={<Icon name='shopping-bag' color='#ffffff' size={15}
            style={{ marginRight: 10 }} />}
          buttonStyle={styles.button}
          title='Order' />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50
  },
  bookInfoPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
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
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#49BD78',
  },
  text: {
    marginTop: 10
  },
  label: {
    fontWeight: '600',
  },
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
});

export default ViewBook