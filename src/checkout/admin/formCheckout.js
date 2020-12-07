import React, { PureComponent } from 'react';
import { View, TextInput, Image, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Card, ListItem, Avatar, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { createCheckoutSchema } from '../../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../../utils/formatError';
import { colorsLocal } from '../../theme';
import moment from "moment";
import GET_ALL_CHECKOUTS from './allCheckouts.graphql';

class FormCheckout extends PureComponent {
  state = {
    values: {
      orderId: null,
      returnDate: null,
      totalPrice: '',
      note: '',
      orderStatus: 'closed',
      bookStatus: '',
      status: 'open'
    },
    order_date: null,
    books: null,
    orders: null,
    showReturnDate: false,
    errors: {},
    isSubmitting: false,
    loading: false
  }

  componentDidMount() {
    if (this.props.getOrderByIdQuery.getOrderById) {
      const { loading, getOrderById: { id, order_date, books, users } } = this.props.getOrderByIdQuery
      this.setState({
        values: {
          ...this.state.values, orderId: id, totalPrice: books.price,
          bookStatus: books.type === 'rent' ? 'rented' : 'sold', returnDate: books.type === 'rent' ? new Date() : null,
          status: books.type === 'rent' ? 'open' : 'closed'
        }, order_date, books, users, loading
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.getOrderByIdQuery.getOrderById) {
      const { loading, getOrderById: { id, order_date, books, users } } = nextProps.getOrderByIdQuery
      this.setState({
        values: {
          ...this.state.values, orderId: id, totalPrice: books.price,
          bookStatus: books.type === 'rent' ? 'rented' : 'sold', returnDate: books.type === 'rent' ? new Date() : null,
          status: books.type === 'rent' ? 'open' : 'closed'
        }, order_date, books, users, loading
      })
    }
  }

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await createCheckoutSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { orderId, returnDate, totalPrice, orderStatus, bookStatus, status, note }, errors } = this.state

    if (Object.keys(errors).length === 0) {
      this.setState({ isSubmitting: true })

      this.props.createCheckoutMutation({
        variables: { orderId, returnDate, totalPrice: parseInt(totalPrice), orderStatus, bookStatus, status, note },
        update: (store, { data: { createCheckout } }) => {
          const { checkout, errors } = createCheckout;

          if (errors) {
            return;
          }

          if (store.data.data.ROOT_QUERY.getAllCheckouts) {
            // Read the data from cache for this query.
            const data = store.readQuery({ query: GET_ALL_CHECKOUTS });

            // Add checkout from the mutation to the end.         
            const getAllCheckoutsUpdated = [checkout, ...data.getAllCheckouts];

            // Write data back to the cache.
            store.writeQuery({ query: GET_ALL_CHECKOUTS, data: { getAllCheckouts: getAllCheckoutsUpdated } });
          }
        }
      }).then(res => {
        const { checkout, errors } = res.data.createCheckout;

        console.log("Resp data: ", checkout, errors)

        if (errors) {
          this.setState({ errors: formatServerErrors(errors) })
        } else {
          this.setState({
            values: {
              orderId: null, returnDate: null, totalPrice: '', note: '',
              orderStatus: 'closed', bookStatus: ''
            }, isSubmitting: false
          })
          this.props.navigation.navigate('Checkouts', { screen: 'AllCheckoutsAdmin' })
        }
      })

    }
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value
      },
      errors,
      isSubmitting: false
    }))
  }

  onReturnDateChange = (event, selectedDate) => {
    let errors = Object.assign({}, this.state.errors);
    delete errors['returnDate'];

    this.setState(state => ({
      values: { ...state.values, returnDate: selectedDate }, errors
    }));
  };

  showReturnDate = () => {
    this.setState(state => ({
      showReturnDate: !state.showReturnDate
    }));
  };

  render() {
    const { values: { orderId, bookStatus, orderStatus, returnDate, totalPrice, status, note }, order_date, books, users, showReturnDate, loading, isSubmitting, errors } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    };

    return (
      <ScrollView>
        {/* Error message */}
        {errors.createCheckout && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.createCheckout}</Text></View>}
        <Card>
          <Card.Title style={styles.cardTitle}>User details</Card.Title>
          <Card.Divider />
          <View style={styles.userInfoContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{users && users.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Email: </Text>{users && users.email}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Phone: </Text>{users && users.phone}
            </Text>
          </View>
          <Card.Title style={styles.cardTitle}>Book details</Card.Title>
          <Card.Divider />
          <View style={styles.bookDetailsContainer}>
            <View style={styles.bookInfoContainer}>
              <ListItem containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <Avatar source={{ uri: books && books.cover_url }} />
                <ListItem.Content>
                  <ListItem.Title>{books && books.title}</ListItem.Title>
                  <ListItem.Subtitle>{books && books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Title>Status</ListItem.Title>
                  <ListItem.Subtitle>{books && books.status}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Title>Book type</ListItem.Title>
                  <ListItem.Subtitle style={styles.type}>{books && books.type}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              {/* <Text style={styles.text}>
                <Text style={styles.label}>Author: </Text>{books && books.authors.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Language: </Text>{books && books.languages.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Category: </Text>{books && books.categories.name}
              </Text> */}
            </View>
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Book status is prefilld according to Book type. If you want to change it, change it from Book's type.</Text></View>
            <Input label="Book status" value={bookStatus} disabled errorStyle={{ color: colors.error }}
              errorMessage={errors.bookStatus} />
          </View>

          <Card.Title style={styles.cardTitle}>Order details</Card.Title>
          <Card.Divider />
          <View>
            <View style={styles.orderInfoContainer}>
              <Text style={styles.text}>
                <Text style={styles.label}>Order Id: </Text>{orderId}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Order date: </Text>{moment(order_date).format('ll')}
              </Text>
            </View>
            <Text style={styles.pickerTitle}>Change Order Status</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={orderStatus}
              prompt='Select Order status'
              onValueChange={(itemValue, itemIndex) => {
                let errors = Object.assign({}, this.state.errors);
                delete errors['orderStatus'];

                this.setState({ values: { ...this.state.values, orderStatus: itemValue }, errors })
              }
              }>
              <Picker.Item label="Closed" value="closed" />
              <Picker.Item label="Pending" value="pending" />
            </Picker>
            {errors.orderStatus && <Text style={styles.customTextError}>{errors.orderStatus}</Text>}
          </View>

          <Card.Title style={styles.cardTitle}>Checkout details</Card.Title>
          <Card.Divider />
          <View>
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Checkout status is prefilld according to Book's type. If you want to make a change to it, do the change from Book's type.</Text></View>
            <Input label="Checkout status" value={status} disabled errorStyle={{ color: colors.error }}
              errorMessage={errors.status} />
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Total price is prefilled stright from Book's price. If you want to make a change, do the change from Book's price.</Text></View>
            <Input label="Total price" value={totalPrice.toString()} disabled errorStyle={{ color: colors.error }}
              errorMessage={errors.totalPrice} />
            {bookStatus === 'rented' && <View style={styles.returnDateContainer}>
              <Text h5 style={styles.label}>Return date</Text>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.dateText}>{moment(returnDate).format('ll')}</Text>
                <Button type='outline' onPress={this.showReturnDate} icon={
                  <Icon
                    name="calendar"
                    size={20}
                    color={colors.primary}
                  />} />
              </View>
              {showReturnDate && (
                <DateTimePicker
                  nativeID='2'
                  testID="dateTimePicker"
                  value={returnDate}
                  display="default"
                  onChange={this.onReturnDateChange}
                />
              )}
              {errors.returnDate && <Text style={styles.customTextError}>{errors.returnDate}</Text>}
            </View>}
            <TextInput
              style={styles.note}
              value={note}
              multiline={true}
              numberOfLines={4}
              onChangeText={text => this.onChangeText('note', text)} placeholder="Write a note..." errorStyle={{ color: colors.error }} />
            <Divider style={styles.divider} />

            <Button
              title="Checkout book"
              icon={
                <Icon
                  name="check-circle"
                  size={20}
                  style={{ marginRight: 10 }}
                  color={colors.white}
                />
              }
              onPress={this.submit}
              disabled={isSubmitting}
            />
          </View>
        </Card>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  bookInfoContainer: {
    marginBottom: 10
  },
  returnDateContainer: {
    marginBottom: 24
  },
  buttonTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderInfoContainer: {
    marginBottom: 30,
  },
  cardTitle: {
    textAlign: 'left',
    fontSize: 18
  },
  pickerTitle: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10
  },
  infoMsgContainer: {
    backgroundColor: colorsLocal.infoBg,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  info: {
    color: colorsLocal.info,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20
  },
  note: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  picker: {
    marginTop: -50,
    marginBottom: -20,
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    fontWeight: '600',
  },
  customTextError: {
    color: colors.error,
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
  },
  currency: {
    fontSize: 12,
    fontWeight: '600',
    color: '#49BD78',
    textTransform: 'uppercase'
  },
  text: {
    textTransform: 'capitalize',
    marginBottom: 4
  },
  type: {
    textTransform: 'uppercase'
  },
  dateText: {
    marginRight: 10
  }
});

const CREATE_CHECKOUT_MUTATION = gql`
  mutation($orderId: Int!, $totalPrice: Float!, $returnDate: DateTime, $orderStatus: String!, $bookStatus: String!, $status: String!, $note: String) {
    createCheckout(orderId: $orderId, totalPrice: $totalPrice, returnDate: $returnDate, orderStatus: $orderStatus, bookStatus: $bookStatus, status: $status, note: $note) {
      checkout {
        id
        total_price
        return_date
        note
        orders {
          id
          books {
            title
            status
            cover_url
          }
          users {
            name
            email
            phone
          }
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

const GET_ORDER_BY_ID_QUERY = gql`
  query($id: Int!) {
    getOrderById(id: $id) {
      id
      order_date
      status
      books {
        id
        title
        cover_url
        status
        price
        type
      }
      users {
        name
        email
        phone
      }
    }
  } 
`

const MutationQueries = compose(
  graphql(CREATE_CHECKOUT_MUTATION, {
    name: "createCheckoutMutation"
  }),
  graphql(GET_ORDER_BY_ID_QUERY, {
    name: "getOrderByIdQuery",
    options: props => ({
      variables: {
        id: props.route.params.id
      }
    })
  })
)(FormCheckout);

export default MutationQueries;
