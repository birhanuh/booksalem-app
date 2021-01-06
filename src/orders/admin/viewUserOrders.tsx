import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, Button, Text, ListItem, Avatar, Badge, colors, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';
import moment from "moment";

import { NavigationScreenProp } from 'react-navigation';

const GET_USER_ORDERS_BY_ID_QUERY = gql`
  query($userId: Int!) {
    getUserOrdersById(userId: $userId) {
      id
      name
      email
      phone
      orders {
        id
        order_date
        status
        books {
          title
          price
          status
          type
          cover_url
        }
      }
    }
  }
`

interface Props {
  route: NavigationScreenProp<any, any> | any;
  navigation: NavigationScreenProp<any, any> | any;
}

const ViewUserOrders: React.SFC<Props> = ({ route, navigation }) => {
  const { loading, error, data } = useQuery(GET_USER_ORDERS_BY_ID_QUERY, { variables: { userId: route.params.id } });

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

  const { getUserOrdersById: { name, email, phone, orders } } = !!data && data

  return (
    <Card>
      <Card.Title>{name}</Card.Title>
      <Text style={styles.text}>
        <Text style={styles.label}>Name: </Text>{name}
      </Text>
      <Text>
        <Text style={styles.label}>Email: </Text>{email}
      </Text>
      <Text style={styles.textPhone} >
        <Text style={styles.label}>Phone: </Text>{phone}
      </Text>
      <Card.Divider />
      {
        orders.map((order, index) => {
          if (order.status !== 'closed') {
            let orderBadgeStatus
            switch (order.status) {
              case 'active':
                orderBadgeStatus = 'primary'
                break;
              case 'pending':
                orderBadgeStatus = 'warning'
                break;
              case 'closed':
                orderBadgeStatus = 'success'
                break;
              default:
                break;
            }
            let bookBadgeStatus
            switch (order.books.status) {
              case 'available':
                bookBadgeStatus = 'success'
                break;
              case 'ordered':
                bookBadgeStatus = 'primary'
                break;
              case 'rented':
                bookBadgeStatus = 'warning'
                break;
              case 'sold':
                bookBadgeStatus = 'error'
                break;
              default:
                break;
            }
            return (<View key={index}><ListItem>
              <Avatar source={{ uri: order.books.cover_url }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: order.books.id } }) }} />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.primary }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: order.books.id } }) }}>{order.books.title}</ListItem.Title>
                <Badge
                  status={bookBadgeStatus}
                  value={order.books.status}
                />
                <Text style={styles.type}>{order.books.type}</Text>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Title>{order.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Title>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Subtitle>Order placed date</ListItem.Subtitle>
                <ListItem.Title>{moment(order.order_date).format('ll')}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Subtitle>Status</ListItem.Subtitle>
                <Badge
                  status={orderBadgeStatus}
                  value={order.status} />
              </ListItem.Content>
            </ListItem>
              <Button
                title={order.status === 'closed' && order.books.type === 'rented' ? 'Update checkout' : 'Checkout book'}
                buttonStyle={styles.button}
                icon={<Icon name='credit-card-alt' color='#ffffff' style={styles.icon} />}
                onPress={() => { navigation.navigate('Checkouts', { screen: 'FormCheckoutAdmin', params: { name: 'Checkout', id: order.id } }) }} />
              <Divider />
            </View>)
          }
        })
      }
    </Card>
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
  text: {
    textTransform: 'capitalize'
  },
  textPhone: {
    textTransform: 'capitalize',
    marginBottom: 8
  },
  label: {
    fontWeight: '600',
  },
  currency: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginTop: 10,
    textTransform: 'uppercase'
  },
  button: {
    marginVertical: 10,
    paddingHorizontal: 5,
    width: '50%'
  },
  type: {
    marginTop: 4,
    textTransform: 'uppercase',
    padding: 2,
    borderWidth: 1,
    borderColor: colors.greyOutline,
  },
  icon: {
    marginRight: 10
  }
});

export default ViewUserOrders