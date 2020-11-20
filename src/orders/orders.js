import React from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Button, colors } from 'react-native-elements';
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

const Orders = () => {
  const { data, loading, error } = useQuery(GET_ORDERS_QUERY);

  const list = [
    {
      id: 1,
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      id: 2,
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    },
    {
      id: 3,
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      id: 4,
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    }
  ]

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
      <FlatList
        data={list}
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
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  }
});

export default Orders
