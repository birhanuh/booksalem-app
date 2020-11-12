import React from 'react';
import { withRouter } from "react-router-native";
import { View, StyleSheet } from 'react-native';
import { ListItem, Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const Menu = ({ history }) => {
  const redirectToUserPage = () => {
    history.push('/user')
  }

  const redirectToSignupPage = () => {
    history.push('/signup')
  }

  const redirectToSigninPage = () => {
    history.push('/login')
  }

  const signout = () => {
    // Remove token from async storage
    try {
      useAsyncStorage.removeItem('@kemetsehaftalem/token')
      return true;
    }
    catch (exception) {
      return false;
    }

    history.push('/')
  }

  const list = [
    {
      icon: 'user-circle',
      title: 'User',
      onPress: redirectToUserPage
    },
    {
      icon: 'sign-in',
      title: 'Signin',
      onPress: redirectToSigninPage
    },
    ,
    {
      icon: 'user-plus',
      title: 'Signup',
      onPress: redirectToSignupPage
    },
  ];

  return (
    <View style={styles.container}>
      {
        list.map((item, i) => (
          <ListItem key={i} bottomDivider>
            <Icon name={item.icon} />
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle} onPress={item.onPress}>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
      }

      <Divider style={{ marginTop: 30, marginBottom: 10 }} />

      <Button
        type="outline"
        style={{ marginTop: 20 }}
        titleStyle={{ color: '#EC3C3E' }}
        buttonStyle={{ borderColor: '#EC3C3E' }}
        icon={
          <Icon
            size={20}
            name='sign-out'
            color='#EC3C3E'
            style={{ marginRight: 10 }}
          />
        }
        onPress={signout}
        title="Sign out"
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 100
  },
  listItemTitle: {
    padding: 10
  },
});

export default withRouter(Menu)