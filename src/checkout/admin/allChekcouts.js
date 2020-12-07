import React from 'react';
import { View, SafeAreaView, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Badge, Button, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import moment from "moment";
import GET_ALL_CHECKOUTS from './allCheckouts.graphql';

const AllCheckouts = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_ALL_CHECKOUTS);

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

  const { getAllCheckouts } = !!data && data;

  return (
    <View style={styles.container}>
      <FlatList
        data={getAllCheckouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let bookBadgeStatus
          switch (item.orders.books.status) {
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
          return (<ListItem
            containerStyle={{ flex: 1, flexWrap: 'wrap', borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 10 }}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.text}>
                <Text style={styles.label}>Name: </Text>{item.orders.users.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Email: </Text>{item.orders.users.email}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Phone: </Text>{item.orders.users.phone}
              </Text>
            </View>
            <View style={styles.bookInfoContainer}>
              <Avatar source={{ uri: item.orders.books.cover_url }} containerStyle={{ marginRight: 12 }} />
              <ListItem.Content>
                <ListItem.Title>{item.orders.books.title}</ListItem.Title>
                <ListItem.Subtitle>{item.total_price + '\u0020'}<Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Title>Return date</ListItem.Title>
                <ListItem.Subtitle>{moment(item.return_date).format('ll')}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content>
                <ListItem.Title>Book status</ListItem.Title>
                <Badge
                  status={bookBadgeStatus}
                  value={item.orders.books.status} />
              </ListItem.Content>
              {/* <ListItem.Content>
              <Badge
                status={badgeStatus}
                value={item.status}
              />
            </ListItem.Content> */}
            </View>
            <View style={styles.checkoutInfoContainer}>
              <Text style={styles.text}>
                <Text style={styles.label}>Note: </Text>{item.note}
              </Text>
            </View>
            {item.orders.books.status === 'rented' && <View style={styles.checkoutInfoContainer}>
              <Button title='Update checkout' type='outline' style={{ marginTop: 10 }}
                onPress={() => { navigation.navigate('Checkouts', { screen: 'EditCheckoutAdmin', params: { name: 'Checkout', id: item.id } }) }} icon={
                  <Icon
                    name="edit"
                    size={20}
                    color={colors.primary}
                    style={{ marginRight: 10 }}
                  />} /></View>}
          </ListItem>)
        }
        } />
    </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  userInfoContainer: {
    marginBottom: 2
  },
  checkoutInfoContainer: {
    borderColor: colors.grey5,
    borderTopWidth: 1,
    width: '100%',
    paddingTop: 2
  },
  bookInfoContainer: {
    flexDirection: 'row',
    borderColor: colors.grey5,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 6
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
  text: {
    marginBottom: 4,
    textTransform: 'capitalize'
  },
});

export default AllCheckouts
