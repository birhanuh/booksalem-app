import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewOrder = () => {

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>HELLO WORLD</Card.Title>
        <Card.Divider />
        <Card.Image source='https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' />
        <Text style={styles.text}>The idea with React Native Elements is more about component structure than actual design.</Text>
        <Button
          icon={<Icon name='code' color='#ffffff' />}
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          title='VIEW NOW' />
      </Card>
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
  text: {
    marginBottom: 10
  },
});

export default ViewOrder