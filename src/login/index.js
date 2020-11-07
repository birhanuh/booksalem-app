import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet } from 'react-native';

const Login = () => {
  const loading = false;
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        Login
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50
  },
  signupContainer: {
    marginTop: 10
  },
  signup: {
    fontSize: 16
  }
});

export default Login
