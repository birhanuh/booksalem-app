import React, { useState } from 'react';
import { withRouter } from "react-router-native";
import { View, StyleSheet } from 'react-native';
import { Button, OverOverlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = ({ history }) => {
  const [isVisible, setIsVisible] = useState(false);

  const menu = () => {
    history.push('/menu')
  }

  const redirectToOrdersPage = () => {
    history.push('/orders')
  }

  const redirectToHomePage = () => {
    history.push('/')
  }

  return (
    <View style={styles.container}><Button
      type="clear"
      icon={
        <Icon
          name="home"
          size={20}
          color='steelblue'
        />
      }
      onPress={redirectToHomePage}
    />
      <Button
        type="clear"
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
    backgroundColor: '#e1e8ee',
    borderTopColor: '#bdc6cf',
    borderTopWidth: 1,
    flex: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    maxHeight: 80
  },
});

export default withRouter(Footer)