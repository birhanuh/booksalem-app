import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text, colors, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';

import { MeContext } from "../context";

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
        language {
          language
        }
        category {
          category
        }
      }
    }
  }  
`

const ViewBook = ({ route }) => {
  const me = React.useContext(MeContext);

  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: route.params.id },
  });

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  };

  const { book: { id, title, author, condition, price, status, published_date, isbn, cover_url, description, rating, language: { language }, category: { category } } } = data && data.getBook

  return (
    <ScrollView>
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
              <Text style={styles.text}>
                <Text style={styles.label}>Condition: </Text>{condition}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Status: </Text>{status}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Published date: </Text>{published_date}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>ISBN: </Text>{isbn}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {price}
              </Text>
              <Text style={styles.currency}>
                ETB
              </Text>
            </View>
          </View>
          <Text style={styles.text}>
            Description: {description}
          </Text>

          <Divider style={styles.divider} />
          <Text style={styles.rating}>
            {rating}
            <Icon id='1' name='star' style={styles.star} />
            <Icon id='2' name='star' style={styles.star} />
            <Icon id='3' name='star' style={styles.star} />
            <Icon id='4' name='star' style={styles.star} />
            <Icon id='5' name='star' style={styles.star} />
          </Text>

          <Divider style={styles.divider} />

          <Button
            icon={<Icon name='shopping-bag' color='#ffffff' size={15}
              style={{ marginRight: 10 }} />}
            buttonStyle={styles.button}
            title='Order' onPress={me ? () => {
              console.log('Ordering...')
            } : () => {
              navigation.push('SignIn')
            }} />
        </Card>
      </View>
    </ScrollView>
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
    justifyContent: 'center'
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
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#49BD78',
  },
  text: {
    marginTop: 10,
    textTransform: 'capitalize'
  },
  currency: {
    marginTop: 10,
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: '600',
  },
  rating: {
    flex: 1,
    textAlign: 'right'
  },
  star: {
    fontSize: 24,
    color: colors.disabled
  },
  divider: {
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
});

export default ViewBook