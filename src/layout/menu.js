import React from 'react';
import { withRouter } from "react-router-native";
import { View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingVertical: 200
  },
  listItemTitle: {
    padding: 10
  },
});

export default withRouter(Menu)