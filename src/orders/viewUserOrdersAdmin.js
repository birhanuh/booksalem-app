import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, Button, Text, ListItem, Avatar, Badge, colors, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';
import moment from "moment";

const GET_ORDER_ADMIN_QUERY = gql`
  query($userId: Int!) {
    getUserOrdersAdmin(userId: $userId) {
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
          cover_url
        }
      }
    }
  }
`

const ViewUserOrdersAdmin = ({ route, navigation }) => {
  const { loading, error, data } = useQuery(GET_ORDER_ADMIN_QUERY, { variables: { userId: route.params.id } });

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

  const { getUserOrdersAdmin: { name, email, phone, orders } } = !!data && data

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>{name}</Card.Title>
        <Text style={styles.text}>
          <Text style={styles.label}>Email: </Text>{email}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Phone: </Text>{phone}
        </Text>
        <Card.Divider />
        {
          orders.map((order, index) => {
            let badgeStatus
            switch (order.status) {
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
            return (<View key={index}><ListItem>
              <Avatar source={{ uri: order.books.cover_url }} />
              <ListItem.Content>
                <ListItem.Subtitle>{order.books.title}</ListItem.Subtitle>
                <Badge
                  status={badgeStatus}
                  value={order.books.status}
                />
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Title>{order.books.price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Title>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Subtitle>{moment(order.order_date).format('ll')}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Subtitle>Order status</ListItem.Subtitle>
                <Badge
                  value={order.status} />
              </ListItem.Content>
            </ListItem>
              <Button
                title='Checkout order'
                buttonStyle={styles.button}
                icon={<Icon name='credit-card-alt' color='#ffffff' style={{ marginRight: 10 }} />}
                onPress={() => { navigation.navigate('Checkouts', { screen: 'FormCheckout', params: { name: 'Checkout', id: order.id } }) }} />
              <Divider />
            </View>)
          })
        }
      </Card>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    marginTop: 10,
    textTransform: 'capitalize'
  },
  currency: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginTop: 10,
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: '600',
  },
  button: {
    marginVertical: 10,
    paddingHorizontal: 5,
    width: '50%'
  }
});

export default ViewUserOrdersAdmin