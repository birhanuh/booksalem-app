import React, { PureComponent } from 'react';
import { View, TextInput, Image, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Card, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { createCheckoutSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';
import moment from "moment";

class FormCheckout extends PureComponent {
  state = {
    values: {
      orderId: null,
      returnDate: null,
      price: '',
      note: '',
      orderStatus: '',
      bookStatus: '',
    },
    errors: {},
    isSubmitting: false,
    loading: false
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

    const { values: { orderId, returnDate, price, orderStatus, bookStatus, note }, errors } = this.state

    if (Object.keys(errors).length === 0) {
      this.setState({ isSubmitting: true })

      const { data: { createCheckout: { checkout, errors } } } = await this.props.createCheckoutMutation({ variables: { orderId, returnDate, price: parseInt(price), orderStatus, bookStatus, note } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        this.props.navigation.navigate('Checkouts')
      }

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

  render() {
    const { values: { orderId, returnDate, price, orderStatus, bookStatus, note }, loading, isSubmitting, errors } = this.state

    const { loading: getOrderByIdLoading } = this.props.getOrderByIdQuery

    if (loading || getOrderByIdLoading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    };

    const { getOrderById: { id, order_date, status, books, users } } = this.props.getOrderByIdQuery

    return (
      <ScrollView>
        {/* Error message */}
        {errors.createCheckout && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.createCheckout}</Text></View>}
        <Card>
          <Card.Title style={styles.cardTitle}>User details</Card.Title>
          <Card.Divider />
          <View style={styles.userInfoContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{users.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Email: </Text>{users.email}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Phone: </Text>{users.phone}
            </Text>
          </View>
          <Card.Title style={styles.cardTitle}>Book details</Card.Title>
          <Card.Divider />
          <View style={styles.bookDetailsContainer}>
            <View style={styles.bookInfoContainer}>
              <View>
                <Text style={styles.text}>
                  <Text style={styles.label}>Title: </Text>{books.title}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Status: </Text>{books.status}
                </Text>

                <Text style={styles.text}>
                  <Text style={styles.label}>Price: </Text><Text style={styles.price}>
                    {books.price + '\u0020'}
                  </Text><Text style={styles.currency}>ETB</Text>
                </Text>
                <Text style={styles.text}>
                  {/* <Text style={styles.label}>Author: </Text>{books.authors.name} */}
                </Text>
                <Text style={styles.text}>
                  {/* <Text style={styles.label}>Language: </Text>{books.languages.name} */}
                </Text>
                <Text style={styles.text}>
                  {/* <Text style={styles.label}>Category: </Text>{books.categories.name} */}
                </Text>
              </View>
              <View style={{ width: 120, height: 70 }}>
                <Image source={{ uri: books.cover_url }} style={{ width: '100%', height: '100%', resizeMode: 'stretch', margin: 5 }} />
              </View>
            </View>
            <View>
              <Text style={styles.pickerTitle}>Change Book Status</Text>
              <Picker
                itemStyle={styles.picker}
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ values: { ...this.state.values, status: itemValue } })
                }>
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Resolved" value="resolved" />
              </Picker>
            </View>
          </View>

          <Card.Title style={styles.cardTitle}>Order details</Card.Title>
          <Card.Divider />
          <View>
            <View style={styles.orderInfoContainer}>
              <Text style={styles.text}>
                <Text style={styles.label}>Id: </Text>{id}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Order date: </Text>{moment(order_date).format('ll')}
              </Text>
            </View>
            <Text style={styles.pickerTitle}>Change Order Status</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={books.status}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, condition: itemValue } })
              }>
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Ordered" value="ordered" />
              <Picker.Item label="Rented" value="rented" />
              <Picker.Item label="Sold" value="sold" />
            </Picker>
          </View>

          <Card.Title style={styles.cardTitle}>Checkout details</Card.Title>
          <Card.Divider />
          <View>
            <Input label="Price is drived stright from Book's price (ETB)" value={books.price.toString()} onChangeText={text => this.onChangeText('price', text)} placeholder="price" errorStyle={{ color: colors.error }}
              errorMessage={errors.price} />
            <TextInput
              style={styles.note}
              value={note}
              multiline={true}
              numberOfLines={4}
              onChangeText={text => this.onChangeText('note', text)} placeholder="Note" errorStyle={{ color: colors.error }} />

            <Divider style={styles.divider} />
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />

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
    marginBottom: 30,
  },
  bookInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -40
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
  note: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  picker: {
    marginTop: -70,
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
    marginTop: -5
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#49BD78',
  },
  currency: {
    marginTop: 10,
    textTransform: 'uppercase'
  },
  text: {
    marginTop: 10,
    textTransform: 'capitalize'
  },
});

const CREATE_CHECKOUT_MUTATION = gql`
  mutation($orderId: Int!, $price: Float!, $returnDate: String!, $orderStatus: String!, $bookStatus: String!, $note: String) {
    createCheckout(orderId: $orderId, price: $price, returnDate: $returnDate, orderStatus: $orderStatus, bookStatus: $bookStatus, note: $note) {
      checkout {
        id
        price
        return
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
