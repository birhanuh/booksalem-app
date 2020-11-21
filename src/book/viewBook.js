import React, { useState } from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text, colors, Divider, Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";

import { MeContext } from "../context";
import { colorsLocal } from '../theme';

const ViewBook = ({ navigation, route, getBookQuery, createOrderMutation }) => {
  const me = React.useContext(MeContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, getBook } = getBookQuery;

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

  const createOrder = async (bookId) => {
    if (!!isSubmitting) {
      setIsSubmitting(true)
    }

    const { data: { order, errors } } = await createOrderMutation({ variables: { bookId } })
    console.log("Resp data: ", order, errors)
    if (errors) {
      setErrors(formatServerErrors(errors));
    } else {
      navigation.navigate('Orders', { screen: 'Orders' })
    }

    setIsSubmitting(false)
  }

  const { id, title, condition, price, status, published_date, isbn, cover_url, description, rating, authors, languages, categories, users } = getBook

  let badgeStatus
  switch (status) {
    case 'active':
      badgeStatus = 'primary'
      break;
    case 'pending':
      badgeStatus = 'warnning'
      break;
    case 'resolved':
      badgeStatus = 'sucess'
      break;
    default:
      break;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        {Object.keys(errors).length !== 0 && <View style={styles.errorMsgContainer}>
          <Text style={styles.error}>{errors.message}</Text>
        </View>}
        <Card style={styles.card}>
          <Card.Title>{title}</Card.Title>
          <Card.Divider />
          <Card.Image source={{ uri: cover_url }} />
          <View style={styles.bookInfoPriceContainer}>
            <View style={styles.bookInfoContainer}>
              <Text style={styles.text}>
                <Text style={styles.label}>Author: </Text>{authors.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Language: </Text>{languages.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Category: </Text>{categories.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Condition: </Text>{condition}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Status: </Text><Badge
                  status={badgeStatus}
                  value={status}
                  containerStyle={{ marginTop: -4 }}
                />
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
            icon={me && me.id === users.id ? <Icon name='pencil-square-o' color='#ffffff' size={15}
              style={{ marginRight: 10 }} /> : <Icon name='shopping-bag' color='#ffffff' size={15}
                style={{ marginRight: 10 }} />}
            buttonStyle={styles.button}
            disabled={isSubmitting}
            title={me && me.id === users.id ? 'Edit' : 'Order'} onPress={me ? (me.id === users.id ? () => {
              navigation.push('EditBook', { name: 'Edit book', book: getBook })
            } : () => createOrder(id)) : () => {
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
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  errorMsgContainer: {
    backgroundColor: colorsLocal.errorBg,
    marginBottom: 26,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  error: {
    color: colors.error,
    fontSize: 18,
    lineHeight: 25,
    paddingHorizontal: 20
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

const GET_BOOK_QUERY = gql`
  query($id: Int!) {
    getBook(id: $id) {
      id
      title
      authors {
        id
        name
      }
      condition
      price
      status
      published_date
      isbn
      cover_url
      description
      rating
      languages {
        id
        name
      }
      categories {
        id
        name
      }
      users {
        id
      }
    }
  }
`

const CREATE_ORDER_MUTATION = gql`
  mutation($bookId: Int!) {
    createOrder(bookId: $bookId) {
      order {
        id
        book_id
        user_id
        order_date
        status
      }
      errors {
        path
        message
      }
    }
  } 
`;

const MutationQuery = compose(
  graphql(GET_BOOK_QUERY, {
    name: "getBookQuery",
    options: props => ({
      variables: {
        id: props.route.params.id
      }
    })
  }),
  graphql(CREATE_ORDER_MUTATION, {
    name: "createOrderMutation"
  })
)(ViewBook);

export default MutationQuery;