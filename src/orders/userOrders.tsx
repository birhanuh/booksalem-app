import React, { useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Button, Badge, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import { colorsLocal } from '../theme';
import moment from "moment";
import GET_USER_ORDERS_QUERY from './userOrders.graphql';
import UPDATED_ORDER_SUBSCRIPTION from './updatedOrder.graphql';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<any, any> | any;
}

const UserOrders: React.SFC<Props> = ({ navigation }) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_USER_ORDERS_QUERY);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update getUserCheckouts
    subscribeToMore({
      document: UPDATED_ORDER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("prev", prev);
        console.log("subscriptionData", subscriptionData);

        if (!subscriptionData.data) {
          return prev;
        }

        // update prev with new data
        return {
          getUserOrders: prev.getUserOrders.map(order => {
            if (order.id === subscriptionData.data.updatedOrder.order.id) {
              return subscriptionData.data.updatedOrder.order
            }
            return order
          })

        };
      },
    })
  }, [subscribeToMore]);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

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

  const { getUserOrders } = !!data && data;

  return (
    <View style={styles.container}>
      { getUserOrders && getUserOrders.length === 0 && <><View style={styles.infoMsgContainer}>
        <Text style={styles.info}>You don&apos;t haver orders placed yet. Go to Books screen, select the Book you wish like to order and place your order by clicking the &apos;Order&apos; button.</Text>
      </View>
        <Button
          icon={<Icon name='book' color='#ffffff' size={15}
            style={{ marginRight: 10 }} />}
          buttonStyle={styles.button}
          title='Go to Books' onPress={() => { navigation.navigate('Books', { screen: 'Books' }) }} /></>}
      <FlatList
        data={getUserOrders}
        ListFooterComponent={renderFooter}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let badgeStatus
          switch (item.status) {
            case 'active':
              badgeStatus = 'primary'
              break;
            case 'pending':
              badgeStatus = 'warning'
              break;
            case 'closed':
              badgeStatus = 'success'
              break;
            default:
              break;
          }
          return (<ListItem
            containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 10 }}>
            <Avatar source={{ uri: item.books.cover_url }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: item.books.id } }) }} />
            <ListItem.Content>
              <ListItem.Title style={{ color: colors.primary }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: item.books.id } }) }}>{item.books.title}</ListItem.Title>
              <ListItem.Subtitle>{item.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Subtitle>Order placed date</ListItem.Subtitle>
              <ListItem.Subtitle>{moment(item.order_date).format('ll')}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Subtitle>Status</ListItem.Subtitle>
              <Badge
                status={badgeStatus}
                value={item.status}
              />
            </ListItem.Content>
          </ListItem>
          )
        }} />
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  infoMsgContainer: {
    backgroundColor: colorsLocal.infoBg,
    marginBottom: 26,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  info: {
    color: colorsLocal.info,
    fontSize: 18,
    lineHeight: 25,
    paddingHorizontal: 20
  },
  currency: {
    fontSize: 12
  }
});

export default UserOrders
