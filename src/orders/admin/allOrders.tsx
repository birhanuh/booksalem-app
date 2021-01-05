import React, { useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Card, Button, Badge, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';
import { colorsLocal } from '../../theme';
import moment from "moment";
import NEW_ORDER_SUBSCRIPTION from './latestOrder.graphql';
import { NavigationScreenProp } from 'react-navigation';

const GET_ORDERS_ADMIN_QUERY = gql`
  query {
    getAllOrders {
      id
      name
      email
      phone
      orders {
        id
        order_date
        status
        user_id
        book_id
        books {
          id
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
  navigation: NavigationScreenProp<any, any> | any;
}

const AllOrders: React.SFC<Props> = ({ navigation }) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_ORDERS_ADMIN_QUERY);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update getAllOrders
    subscribeToMore({
      document: NEW_ORDER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("prev", prev);
        console.log("subscriptionData", subscriptionData);

        if (!subscriptionData.data) {
          return prev;
        }

        // update prev with new data
        return {
          getAllOrders: [
            ...prev.getAllOrders,
            subscriptionData.data.latestOrder.order,
          ],
        };
      },
    })
  }, []);

  const renderFooter = () => {
    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    } else {
      return null
    }
  }

  const renderSeprator = () => (
    <View style={{ height: 1, width: '86%', backgroundColor: colors.divider, marginLeft: '14%' }} />
  )

  const { getAllOrders } = !!data && data;

  return (
    <View>
      { getAllOrders && getAllOrders.length === 0 && <View style={styles.infoMsgContainer}>
        <Text style={styles.info}>No one has placed an order yet.</Text>
      </View>}
      <FlatList
        data={getAllOrders}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeprator}
        renderItem={({ item }) => (
          <Card containerStyle={styles.card}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{item.name}
            </Text>
            <Text>
              <Text style={styles.label}>Email: </Text>{item.email}
            </Text>
            <Text style={styles.textPhone}>
              <Text style={styles.label}>Phone: </Text>{item.phone}
            </Text>
            <Card.Divider />
            <Text h4>Orders</Text>
            {item.orders.map(order => {
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
                return (<ListItem key={order.id}
                  containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                  <Avatar source={{ uri: order.books.cover_url }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: order.books.id } }) }} />
                  <ListItem.Content>
                    <ListItem.Title style={{ color: colors.primary }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: order.books.id } }) }}>{order.books.title}</ListItem.Title>
                    <Badge
                      status={bookBadgeStatus}
                      value={order.books.status} />
                    <Text style={styles.type}>{order.books.type}</Text>
                  </ListItem.Content>
                  <ListItem.Content>
                    <ListItem.Subtitle>Order placed date</ListItem.Subtitle>
                    <ListItem.Title>{moment(order.order_date).format('ll')}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Content>
                    <ListItem.Title>{order.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Content>
                    <ListItem.Subtitle>Status</ListItem.Subtitle>
                    <Badge
                      status={orderBadgeStatus}
                      value={order.status} />
                  </ListItem.Content>
                </ListItem>)
              }
            })}
            <Button
              type='outline'
              title="View orders"
              icon={
                <Icon
                  name="eye"
                  size={20}
                  style={{ marginRight: 10 }}
                  color='white'
                />
              }
              onPress={() => { navigation.push('ViewUserOrdersAdmin', { name: 'View user orders (Admin view)', id: item.id }) }}
            />

          </Card>)
        } />
    </View>)
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  },
  infoMsgContainer: {
    backgroundColor: colorsLocal.infoBg,
    marginBottom: 26,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  info: {
    color: colorsLocal.info,
    fontSize: 18,
    lineHeight: 25,
    paddingHorizontal: 20
  },
  type: {
    marginTop: 4,
    textTransform: 'uppercase',
    padding: 2,
    borderWidth: 1,
    borderColor: colors.greyOutline,
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
  text: {
    textTransform: 'capitalize'
  },
  textPhone: {
    textTransform: 'capitalize',
    marginBottom: 8
  },
  currency: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: '600',
  },
});

export default AllOrders
