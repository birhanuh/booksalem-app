import React, { useEffect, useContext } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Button, ListItem, Avatar, Badge, colors } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import { colorsLocal } from '../theme';
import moment from "moment";
import NEW_USER_CHECKOUT_SUBSCRIPTION from './latestCheckout.graphql';
import { UserCheckoutNotificationContext } from "../context";
import { NavigationScreenProp } from 'react-navigation';

const GET_USER_CHECKOUTS = gql`
  query {
    getUserCheckouts {
      id
      total_price
      status
      return_date
      orders {
        id
        books {
          id
          title
          cover_url
          price
        }
      }
    }
  }
`

interface Props {
  navigation: NavigationScreenProp<any, any> | any;
}

const UserCheckouts: React.SFC<Props> = ({ navigation }) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_USER_CHECKOUTS);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update getUserCheckouts 
    subscribeToMore({
      document: NEW_USER_CHECKOUT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("prev", prev);
        console.log("subscriptionData", subscriptionData);

        if (!subscriptionData.data) {
          return prev;
        }

        // update prev with new data
        return {
          getUserCheckouts: [
            ...prev.getUserCheckouts,
            subscriptionData.data.latestCheckout.checkout,
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

  const count = useContext(UserCheckoutNotificationContext)

  const { getUserCheckouts } = !!data && data

  return (
    <UserCheckoutNotificationContext.Provider value={0}>
      <View style={styles.container}>
        {getUserCheckouts && getUserCheckouts.length === 0 && <><View style={styles.infoMsgContainer}>
          <Text style={styles.info}>You don't have checkouts yet. Go to Books screen, select the Book you wish like to order and place your order. Then the Admin will decide when to checkout the book for you.</Text>
        </View>
          <Button
            icon={<Icon name='book' color='#ffffff' size={15}
              style={{ marginRight: 10 }} />}
            buttonStyle={styles.button}
            title='Go to Books' onPress={() => { navigation.navigate('Books', { screen: 'Books' }) }} /></>}

        <FlatList
          data={getUserCheckouts && getUserCheckouts}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let badgeStatus
            switch (item.status) {
              case 'open':
                badgeStatus = 'primary'
                break;
              case 'closed':
                badgeStatus = 'success'
                break;
              default:
                break;
            }
            return (<ListItem
              containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 10 }}>
              <Avatar source={{ uri: item.orders.books.cover_url }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: item.orders.books.id } }) }} />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.primary }} onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: item.orders.books.id } }) }}>{item.orders.books.title}</ListItem.Title>
                <ListItem.Subtitle>{item.orders.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
              </ListItem.Content>
              {item.status === 'open' && <ListItem.Content>
                <ListItem.Subtitle>Return date</ListItem.Subtitle>
                <ListItem.Subtitle>{moment(item.return_date).format('ll')}</ListItem.Subtitle>
              </ListItem.Content>}
              <ListItem.Content>
                <ListItem.Subtitle>Status</ListItem.Subtitle>
                <Badge
                  status={badgeStatus}
                  value={item.status}
                />
              </ListItem.Content>
            </ListItem>)
          }
          } />
      </View></UserCheckoutNotificationContext.Provider>)
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
  info: {
    color: colorsLocal.info,
    fontSize: 18,
    lineHeight: 25,
    paddingHorizontal: 20
  },
  currency: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  button: {
    marginVertical: 10,
    paddingHorizontal: 5,
    width: '50%'
  },
});

export default UserCheckouts
