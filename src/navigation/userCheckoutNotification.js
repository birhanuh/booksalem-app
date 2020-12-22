import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge, colors } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import NEW_USER_CHECKOUT_SUBSCRIPTION from '../checkout/latestCheckout.graphql';

import { UserCheckoutNotificationContext } from "../context";

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

const UserCheckoutNotification = ({ iconName, iconColor, size }) => {
  const { loading, error, subscribeToMore } = useQuery(GET_USER_CHECKOUTS);
  const [count, setCount] = useState(useContext(UserCheckoutNotificationContext));

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
        console.log('New checkout')
        const countIncrement = count + 1
        setCount(countIncrement)
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

  return (
    <>
      <Icon name={iconName} size={size} color={iconColor} />
      {count !== 0 &&
        <Badge
          status="success"
          value={count}
          containerStyle={{ position: 'absolute', top: 4, right: 8 }}
        />}
    </>)
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
});

export default UserCheckoutNotification
