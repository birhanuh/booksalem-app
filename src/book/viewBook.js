import React, { useState } from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text, colors, Divider, Badge, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";

import { MeContext } from "../context";
import { colorsLocal } from '../theme';

const ViewBook = ({ navigation, getBookQuery, createOrderMutation, getUsersOrdersQuery, cancelOrderMutation }) => {
  const me = React.useContext(MeContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const { loading, error, getBook } = getBookQuery;

  const { id, title, condition, price, status, published_date, isbn, cover_url, description, rating, authors, languages, categories, users } = !!getBook && getBook

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

  const cancelOrder = async (bookId) => {
    if (!!isSubmitting) {
      setIsSubmitting(true)
    }

    const { data: { order, errors } } = await cancelOrderMutation({ variables: { bookId } })
    console.log("Resp data: ", order, errors)
    if (errors) {
      setErrors(formatServerErrors(errors));
    } else {
      navigation.navigate('Orders', { screen: 'Orders' })
    }

    setIsSubmitting(false)
  }

  const deleteBook = async (bookId) => {
    console.log('Delete book...')
    if (!!isSubmitting) {
      setIsSubmitting(true)
    }

    const { data: { book, errors } } = await deleteBookMutation({ variables: { bookId } })
    console.log("Resp data: ", book, errors)
    if (errors) {
      setErrors(formatServerErrors(errors));
    } else {
      navigation.push('Books')
    }

    setIsSubmitting(false)
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
      navigation.push('SignIn')
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

  return [
    <ScrollView key='scrollview'>
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
              <Text style={styles.currency + '\u0020'}>
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
    </ScrollView>,
    <Overlay key='overlay' isVisible={visible} onBackdropPress={toggleOverlay}>
      <View style={styles.deleteBtnContainer}>
        <Text style={styles.errorModal}>Are you sure you want delete Book?!</Text>
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
          onPress={deleteBook}
          title="Delete book"
        /></View>
    </Overlay>
  ]
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

const GET_ORDERS_QUERY = gql`
  query {
    getUsersOrders {
      book_id
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

const CANCEL_ORDER_MUTATION = gql`
  mutation($bookId: Int!) {
    cancelOrder(bookId: $bookId) {
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

const MutationsQueries = compose(
  graphql(GET_BOOK_QUERY, {
    name: "getBookQuery",
    options: props => ({
      variables: {
        id: props.route.params.id
      }
    })
  }),

  graphql(GET_ORDERS_QUERY, {
    name: "getUsersOrdersQuery"
  }),
  graphql(CREATE_ORDER_MUTATION, {
    name: "createOrderMutation"
  }),
  graphql(CANCEL_ORDER_MUTATION, {
    name: "cancelOrderMutation"
  })
)(ViewBook);

export default MutationsQueries;