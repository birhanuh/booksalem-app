import React, { PureComponent } from 'react';
import { View, TextInput, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Card, ListItem, Avatar, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { updateCheckoutSchema } from '../../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../../utils/formatError';
import { colorsLocal } from '../../theme';
import moment from "moment";
import GET_ALL_CHECKOUTS from './allCheckouts.graphql';

import { NavigationScreenProp } from 'react-navigation';

interface State {
  values: Record<string, unknown>;
  orders: Record<string, unknown>;
  users: Record<string, unknown>;
  showReturnDate: boolean,
  errors: { [key: string]: string } | Record<string, unknown>;
  isSubmitting: boolean;
  loading: boolean;
}


interface Props {
  updateCheckoutMutation: (variables: any) => Promise<any | null>;
  navigation: NavigationScreenProp<any, any> | any;
  getCheckoutByIdQuery: any;
  route: any;
}

class EditCheckout extends PureComponent<Props, State> {
  state = {
    values: {
      checkoutId: null,
      returnDate: null,
      totalPrice: '',
      note: '',
      bookStatus: '',
      status: ''
    },
    users: null,
    orders: null,
    showReturnDate: false,
    errors: {
      updateCheckout: '',
      orderStatus: '',
      status: '',
      totalPrice: '',
      returnDate: '',
      bookStatus: ''
    },
    isSubmitting: false,
    loading: false
  }

  componentDidMount() {
    if (this.props.getCheckoutByIdQuery.getCheckoutById) {
      const { loading, getCheckoutById: { id, total_price, return_date, note, orders, users } } = this.props.getCheckoutByIdQuery
      this.setState({
        values: {
          ...this.state.values, checkoutId: id, totalPrice: total_price,
          bookStatus: orders.books.status, returnDate: new Date(return_date), status, note
        }, orders, users, loading
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.getCheckoutByIdQuery.getCheckoutById) {
      const { loading, getCheckoutById: { id, total_price, return_date, status, note, orders, users } } = nextProps.getCheckoutByIdQuery
      this.setState({
        values: {
          ...this.state.values, checkoutId: id, totalPrice: total_price,
          bookStatus: orders.books.status, returnDate: return_date, status, note
        }, orders, users, loading
      })
    }
  }

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await updateCheckoutSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { checkoutId, returnDate, totalPrice, bookStatus, status, note }, errors } = this.state

    if (Object.keys(errors).length === 0) {
      this.setState({ isSubmitting: true })

      this.props.updateCheckoutMutation({
        variables: { checkoutId, returnDate, totalPrice: parseInt(totalPrice), bookStatus, status, note },
        update: (store, { data: { updateCheckout } }) => {
          const { checkout, errors } = updateCheckout;

          if (errors) {
            return;
          }

          // Read the data from cache for this query.
          const data = store.readQuery({ query: GET_ALL_CHECKOUTS });

          // Add checkout from the mutation to the end.  
          data.getAllCheckouts.map(item => {
            if (item.id === checkout.id) {
              return checkout;
            }
          });

          // Write data back to the cache.
          store.writeQuery({ query: GET_ALL_CHECKOUTS, data });
        }
      }).then(res => {
        const { checkout, errors } = res.data.updateCheckout;

        console.log("Resp data: ", checkout, errors)

        if (errors) {
          this.setState({ errors: formatServerErrors(errors) })
        } else {
          this.props.navigation.navigate('Checkouts', { screen: 'AllCheckoutsAdmin' })
        }
      })
    }
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    const errors = Object.assign({}, this.state.errors);
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
    const errors = Object.assign({}, this.state.errors);
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
    const { values: { bookStatus, returnDate, totalPrice, status, note }, orders, users, showReturnDate, isSubmitting, errors, loading } = this.state

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
        {errors.updateCheckout && <View style={{ backgroundColor: colors.error }}><Text style={{ color: "white" }}>{errors.updateCheckout}</Text></View>}
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
          <View>
            <View style={styles.bookInfoContainer}>
              <ListItem containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <Avatar source={{ uri: orders && orders.books.cover_url }} />
                <ListItem.Content>
                  <ListItem.Title>{orders && orders.books.title}</ListItem.Title>
                  <ListItem.Subtitle>{orders && orders.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Title>Status</ListItem.Title>
                  <ListItem.Subtitle>{orders && orders.books.status}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Title>Book type</ListItem.Title>
                  <ListItem.Subtitle style={styles.type}>{orders && orders.books.type}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              {/* <Text style={styles.text}>
                <Text style={styles.label}>Author: </Text>{orders && orders.books.authors.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Language: </Text>{orders && orders.books.languages.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Category: </Text>{orders && orders.books.categories.name}
              </Text> */}
            </View>
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Current Book status is Rented. You can change it from here.</Text></View>
            <Picker
              itemStyle={styles.picker}
              selectedValue={bookStatus}
              prompt='Select Book status'
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, bookStatus: itemValue } })
              }>
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Rented" value="rented" />
            </Picker>
            {errors.bookStatus && <Text style={styles.customTextError}>{errors.bookStatus}</Text>}
          </View>

          <Card.Title style={styles.cardTitle}>Checkout details</Card.Title>
          <Card.Divider />
          <View>
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Current Checkout status is open. You can change it from here.</Text></View>
            <Picker
              itemStyle={styles.picker}
              selectedValue={status}
              prompt='Select Book status'
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, status: itemValue } })
              }>
              <Picker.Item label="Open" value="open" />
              <Picker.Item label="Close" value="closed" />
            </Picker>
            {errors.status && <Text style={styles.customTextError}>{errors.status}</Text>}
            <View style={styles.infoMsgContainer}>
              <Text style={styles.info}>Total price is prefilled stright from Book&apos;s price. If you want to make a change, do the change from Book&apos;s price.</Text></View>
            <Input label="Total price" value={totalPrice.toString()} disabled errorStyle={{ color: colors.error }}
              errorMessage={errors.totalPrice} />
            {bookStatus === 'rented' && <View style={styles.returnDateContainer}>
              <Text style={styles.label}>Return date</Text>
              <View style={styles.infoMsgContainer}>
                <Text style={styles.info}>Current Return date is as shown bellow. You can modify it from here.</Text></View>
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
              onChangeText={text => this.onChangeText('note', text)} placeholder="Write a note..." />
            <Divider style={styles.divider} />

            <Button
              title="Update checkout"
              icon={
                <Icon
                  name="check-circle"
                  size={20}
                  style={{ marginRight: 10 }}
                  color='white'
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
  cardTitle: {
    textAlign: 'left',
    fontSize: 18
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
    marginTop: 10,
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

const UPDATE_CHECKOUT_MUTATION = gql`
  mutation($checkoutId: Int!, $totalPrice: Float, $returnDate: DateTime, $bookStatus: String, $status: String!, $note: String) {
    updateCheckout(checkoutId: $checkoutId, totalPrice: $totalPrice, returnDate: $returnDate, bookStatus: $bookStatus, status: $status, note: $note) {
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

const GET_CHECKOUT_BY_ID_QUERY = gql`
  query($id: Int!) {
    getCheckoutById(id: $id) {
      id
      total_price
      return_date
      note
      orders {
        id
        books {
          title
          cover_url
          status
          price
          type
        }
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
  graphql(UPDATE_CHECKOUT_MUTATION, {
    name: "updateCheckoutMutation"
  }),
  graphql(GET_CHECKOUT_BY_ID_QUERY, {
    name: "getCheckoutByIdQuery",
    options: (props: Props) => ({
      variables: {
        id: props.route.params.id
      }
    })
  })
)(EditCheckout);

export default MutationQueries;
