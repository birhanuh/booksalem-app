import React from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, ListItem, Avatar, Button, Badge, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import { colorsLocal } from '../theme';
import moment from "moment";
import GET_USER_ORDERS_QUERY from './userOrders.graphql';

const UserOrders = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_USER_ORDERS_QUERY);

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

  const { getUserOrders } = !!data && data;

  return (
    <View style={styles.container}>
      { getUserOrders && getUserOrders.length === 0 && <><View style={styles.infoMsgContainer}>
        <Text style={styles.info}>You don't haver orders placed yet. Go to Books screen, select the Book you wish like to order and place your order by clicking the 'Order' button.</Text>
      </View>
        <Button
          icon={<Icon name='book' color='#ffffff' size={15}
            style={{ marginRight: 10 }} />}
          buttonStyle={styles.button}
          title='Books' onPress={() => { navigation.navigate('Books', { screen: 'Books' }) }} /></>}
      <FlatList
        data={getUserOrders}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={renderSeprator}
        renderItem={({ item }) => {
          let badgeStatus
          switch (item.status) {
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
          return (<ListItem
            containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
            onPress={() => { navigation.navigate('Books', { screen: 'ViewBook', params: { id: item.books.id } }) }}>
            <Avatar source={{ uri: item.books.cover_url }} />
            <ListItem.Content>
              <ListItem.Title>{item.books.title}</ListItem.Title>
              <ListItem.Subtitle>{item.books.price + '\u0020'} <Text style={styles.currency}>ETB</Text></ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Subtitle>{moment(item.order_date).format('ll')}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
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
