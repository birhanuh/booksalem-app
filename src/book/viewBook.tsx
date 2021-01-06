import React, { useState } from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text, colors, Divider, Badge, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql } from '@apollo/client/react/hoc';
import compose from "lodash.flowright";
import { connect } from "react-redux";

import { colorsLocal } from '../theme';
import GET_USERS_ORDERS_QUERY from '../orders/userOrders.graphql';
import GET_AVAILABLE_BOOKS from './availableBooks.graphql';
import GET_BOOK_QUERY from './book.graphql';
import DELETE_BOOK_MUTATION from './deleteBook.graphql';
import CREATE_ORDER_MUTATION from './createOrder.graphql';
import CANCEL_ORDER_MUTATION from './cancelOrder.graphql';
import { formatServerErrors } from '../utils/formatError';
import { NavigationScreenProp } from 'react-navigation';

interface Me {
  __typename: string;
  id: string;
  email: string;
  is_admin: boolean,
  name: string;
  phone: string;
}

interface Props {
  me: Me;
  navigation: NavigationScreenProp<any, any> | any;
  getBookQuery: any;
  deleteBookMutation: any;
  createOrderMutation: any;
  getUsersOrdersQuery: any;
  cancelOrderMutation: any;
}

const ViewBook: React.SFC<Props> = ({ me, navigation, getBookQuery, deleteBookMutation, createOrderMutation, getUsersOrdersQuery, cancelOrderMutation }) => {

  const [errors, setErrors] = useState({ message: '' } || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const { loading, error, getBook } = getBookQuery;

  const { id, title, condition, price, type, status, published_date, isbn, cover_url, description, rating, authors, languages, categories, users } = !!getBook && getBook

  const { getUsersOrders } = getUsersOrdersQuery;
  const isAlreadyOrdered = getUsersOrders && getUsersOrders.filter(order => order.book_id === id);

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

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const createOrder = async (bookId) => {
    if (isSubmitting) {
      setIsSubmitting(true)
    }

    const { data: { order, errors } } = await createOrderMutation({ variables: { bookId } })
    console.log("Resp data: ", order, errors)
    if (errors) {
      setErrors(formatServerErrors(errors));
    } else {
      navigation.navigate('UsersOrders', { screen: 'UsersOrders' })
    }

    setIsSubmitting(false)
  }

  const cancelOrder = async (bookId) => {
    if (isSubmitting) {
      setIsSubmitting(true)
    }

    const { data: { order, errors } } = await cancelOrderMutation({ variables: { bookId } })
    console.log("Resp data: ", order, errors)
    if (errors) {
      setErrors(formatServerErrors(errors));
    } else {
      navigation.navigate('UsersOrders', { screen: 'UsersOrders' })
    }

    setIsSubmitting(false)
  }

  const deleteBook = (id) => {
    console.log('Delete book...')
    if (isSubmitting) {
      setIsSubmitting(true)
    }

    deleteBookMutation({
      variables: { id }, update: (store, { data: { deleteBook } }) => {
        const { book, errors } = deleteBook;

        if (errors) {
          return;
        }

        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: GET_AVAILABLE_BOOKS
        });

        // Clone getAbailableBooks.
        const getAvailableBooksCloned = Object.assign(data.getAvailableBooks);
        // Filter the book that was deleted.
        const getAvailableBooksUpdated = getAvailableBooksCloned.filter(
          item => item.id !== book.id
        );

        // Write our data back to the cache.
        store.writeQuery({ query: GET_AVAILABLE_BOOKS, data: { getAvailableBooks: getAvailableBooksUpdated } });
      }
    }).then(res => {
      const { book, errors } = res.data.deleteBook;

      console.log("Resp data: ", book, errors)
      if (errors) {
        setErrors(formatServerErrors(errors));
      } else {
        navigation.push('Books')
      }

      setVisible(false)
      setIsSubmitting(false)
    }).catch(err => {
      setIsSubmitting(false)
      setErrors(err);
    });

  }

  const onPressConditioned = (bookId) => {
    if (me) {
      if (me.id === users.id) {
        navigation.push('EditBook', { name: 'Edit book', book: getBook })
      } else if (isAlreadyOrdered && isAlreadyOrdered.length > 0 && Object.keys(isAlreadyOrdered[0]).length !== 0) {
        cancelOrder(bookId);
      } else if ((me.id !== users.id)) {
        createOrder(bookId);
      }
    } else {
      navigation.navigate('SignIn', { screen: 'CreateAccount' })
    }
  }

  const titleConditioned = () => {
    if (me) {
      if (me.id === users.id) {
        return 'Edit';
      }
      if (isAlreadyOrdered && isAlreadyOrdered.length > 0 && Object.keys(isAlreadyOrdered[0]).length !== 0) {
        return 'Cancel order'
      }
    }
    return 'Order';
  }

  const iconConditioned = () => {
    if (me) {
      if (me.id === users.id) {
        return 'pencil-square-o';
      }
      if (isAlreadyOrdered && isAlreadyOrdered.length > 0 && Object.keys(isAlreadyOrdered[0]).length !== 0) {
        return 'minus-circle'
      }
    }
    return 'shopping-bag';
  }

  let badgeStatus
  switch (status) {
    case 'available':
      badgeStatus = 'success'
      break;
    case 'ordered':
      badgeStatus = 'primary'
      break;
    case 'rented':
      badgeStatus = 'warning'
      break;
    case 'sold':
      badgeStatus = 'error'
      break;
    default:
      break;
  }

  return (<>
    <ScrollView key='scrollview'>
      <View style={styles.container}>
        {Object.keys(errors).length !== 0 && <View style={styles.errorMsgContainer}>
          <Text style={styles.error}>{errors.message}</Text>
        </View>}
        <Card containerStyle={styles.card}>
          <Card.Title>{title}</Card.Title>
          <Text style={styles.type}>{type}</Text>
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
                {price + '\u0020'}
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
            <Icon name='star' style={styles.star} />
            <Icon name='star' style={styles.star} />
            <Icon name='star' style={styles.star} />
            <Icon name='star' style={styles.star} />
            <Icon name='star' style={styles.star} />
          </Text>

          <Divider style={styles.divider} />

          <Button
            icon={<Icon name={iconConditioned()} color='#ffffff' size={15}
              style={{ marginRight: 10 }} />}
            buttonStyle={styles.button}
            disabled={isSubmitting}
            title={titleConditioned()} onPress={() => onPressConditioned(id)} />
        </Card>

        <Divider style={styles.divider} />

        {me && me.id === users.id && <View style={styles.deleteBtnContainer}><Button
          type="outline"
          titleStyle={{ color: colors.error }}
          buttonStyle={{ borderColor: colors.error }}
          icon={
            <Icon
              size={20}
              name='trash-o'
              color={colors.error}
              style={{ marginRight: 10 }}
            />
          }
          onPress={toggleOverlay}
          title="Delete book"
        /></View>}
      </View>
    </ScrollView>
    <Overlay key='overlay' isVisible={visible} onBackdropPress={toggleOverlay}>
      <View style={styles.deleteBtnContainer}>
        <Text style={styles.errorModal}>Are you sure you want to delete this Book?!</Text>
        <Button
          type="outline"
          titleStyle={{ color: colors.error }}
          buttonStyle={{ borderColor: colors.error }}
          icon={
            <Icon
              size={20}
              name='trash-o'
              color={colors.error}
              style={{ marginRight: 10 }}
            />
          }
          onPress={() => deleteBook(id)}
          title="Delete book"
        /></View>
    </Overlay>
  </>)
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
  bookInfoContainer: {
    marginBottom: 10
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
  type: {
    textTransform: 'uppercase',
    position: 'absolute',
    right: 0,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.greyOutline,
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
  },
  errorModal: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 30
  },
  deleteBtnContainer: {
    marginBottom: 26,
    paddingHorizontal: 14,
    marginVertical: 14
  },
});

const MutationsQueries = compose(
  graphql(GET_BOOK_QUERY, {
    name: "getBookQuery",
    options: (props: any) => ({
      variables: {
        id: props.route.params.id
      }
    })
  }),
  graphql(DELETE_BOOK_MUTATION, {
    name: "deleteBookMutation"
  }),
  graphql(GET_USERS_ORDERS_QUERY, {
    name: "getUsersOrdersQuery"
  }),
  graphql(CREATE_ORDER_MUTATION, {
    name: "createOrderMutation"
  }),
  graphql(CANCEL_ORDER_MUTATION, {
    name: "cancelOrderMutation"
  })
)(ViewBook);

export default connect(state => ({ me: state.me }))(MutationsQueries)