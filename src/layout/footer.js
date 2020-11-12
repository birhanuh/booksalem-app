import React from 'react';
import { withRouter } from "react-router-native";
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = ({ history }) => {
  const menu = () => {
    history.push('/menu')
  }

  const redirectToAddBookPage = () => {
    history.push('/book/add')
  }

  const redirectToOrdersPage = () => {
    history.push('/orders')
  }

  const redirectToHomePage = () => {
    history.push('/')
  }

  return (
    <View style={styles.container}>
      <Button
        type="clear"
        title="Home"
        buttonStyle={styles.button}
        titleStyle={styles.title}
        icon={
          <Icon
            name="home"
            size={20}
            color='steelblue'
          />
        }
        onPress={redirectToHomePage}>
      </Button>
      <Button
        type="clear"
        title="Add book"
        buttonStyle={{ display: 'flex', flexWrap: 'wrap', width: 78 }}
        titleStyle={styles.title}
        icon={
          <Icon
            name="plus-circle"
            size={20}
            color='steelblue'
          />
        }
        onPress={redirectToAddBookPage}
      />
      <Button
        type="clear"
        title="Orders"
        buttonStyle={styles.button}
        titleStyle={styles.title}
        icon={
          <Icon
            name="th-list"
            size={20}
            color='steelblue'
          />
        }
        onPress={redirectToOrdersPage}
      />
      <Button
        type="clear"
        title="Settings"
        buttonStyle={styles.button}
        titleStyle={styles.title}
        icon={
          <Icon
            name="ellipsis-v"
            size={20}
            color='steelblue'
          />
        }
        onPress={menu}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'powderblue',
    borderTopColor: 'skyblue',
    borderTopWidth: 1,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    maxHeight: 80
  },
  button: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 70
  },
  title: {
    fontSize: 14
  }
});

export default withRouter(Footer)