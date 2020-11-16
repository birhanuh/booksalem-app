import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem, Button, Divider, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const signOut = () => {
    // Remove token from async storage
    try {
      useAsyncStorage.removeItem('@kemetsehaftalem/token')
      navigation.push('Books')
    }
    catch (exception) {
      return false;
    }
  }

  const list = [
    {
      icon: 'user-circle',
      title: 'User',
      onPress: () => {
        navigation.push('User')
      }
    },
    {
      icon: 'sign-in',
      title: 'Sign In',
      onPress: () => {
        navigation.push('SignIn')
      }
    },
    ,
    {
      icon: 'user-plus',
      title: 'Create account',
      onPress: () => {
        navigation.push('CreateAccount')
      }
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
        titleStyle={{ color: colors.error }}
        buttonStyle={{ borderColor: colors.error }}
        icon={
          <Icon
            size={20}
            name='sign-out'
            color={colors.error}
            style={{ marginRight: 10 }}
          />
        }
        onPress={signOut}
        title="Sign out"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  listItemTitle: {
    padding: 10
  },
});

export default Settings