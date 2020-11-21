import React from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Button, colors, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';

const GET_ORDERS_QUERY = gql`
  query {
    getOrders {
      id
      user_id
      book_id
      status
      order_date
    }
  } 
`

const Orders = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_ORDERS_QUERY);

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

  const renderSeprator = () => (
    <View style={{ height: 1, width: '86%', backgroundColor: colors.divider, marginLeft: '14%' }} />
  )

  const { getOrders } = !!data && data;

  return (
    <View style={styles.container}>
      { getOrders && getOrders.length === 0 && <><View style={styles.errorMsgContainer}>
        <Text style={styles.error}>You don't haver orders placed yet. Go to Books screen, select the Book you wish like to order and place your order by clicking the 'Order' button.</Text>
      </View>
        <Button
          icon={<Icon name='book' color='#ffffff' size={15}
            style={{ marginRight: 10 }} />}
          buttonStyle={styles.button}
          title='Books' onPress={() => { navigation.navigate('Books', { screen: 'Books' }) }} /></>}
      <FlatList
        data={getOrders}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={renderSeprator}
        renderItem={({ item }) => (
          <ListItem
            containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <Avatar source={{ uri: item.avatar_url }} />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
              icon={<Icon name='eye' color='#ffffff' size={15}
                style={{ marginRight: 10 }} />}
              buttonStyle={styles.button}
              title='View' onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: l.id } }) }} />
          </ListItem>
        )} />
    </View>)
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  errorMsgContainer: {
    backgroundColor: colors.white,
    marginBottom: 26,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  error: {
    color: colors.error,
    fontSize: 18,
    lineHeight: 25,
    paddingHorizontal: 20
  },
});

export default Orders
