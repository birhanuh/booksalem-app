import React from 'react';
import { withRouter } from "react-router-native";
import { View, StyleSheet } from 'react-native';
import { Button, colors } from 'react-native-elements';
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
            color={colors.primary}
          />
        }
        onPress={redirectToHomePage}>
      </Button>
      <Button
        type="clear"
        title="Add book"
        buttonStyle={styles.button}
        titleStyle={styles.title}
        icon={
          <Icon
            name="plus-circle"
            size={20}
            color={colors.primary}
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
            color={colors.primary}
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
            color={colors.primary}
          />
        }
        onPress={menu}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'powderblue',
    borderTopColor: 'skyblue',
    borderTopWidth: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 14
  }
});

export default withRouter(Footer)