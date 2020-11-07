import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet, TextInput, Button } from 'react-native';
import { graphql, gql } from '@apollo/react-hoc';

class Signup extends React.PureComponent {
  state = {
    values: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    errors: {},
    isSubmitting: false,
    loading: false
  }

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    this.setState({ isSubmitting: true })
    const { name, email, password } = this.state.values

    const { data: { error, user, token } } = await this.props.mutate({ variables: { name, email, password } })
    console.log(user)

    this.setState({ isSubmitting: false })
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value
      }
    }))
  }

  render() {
    const { values: { name, email, password, confirmPassword }, loading } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Signup</Text>
        <View style={styles.signupContainer}>
          <TextInput value={name} onChangeText={text => this.onChangeText('name', text)} style={styles.textInput} placeholder="Name" />
          <TextInput value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" style={styles.textInput} placeholder="Email" />
          <TextInput secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} style={styles.textInput} placeholder="Password" />
          <TextInput secureTextEntry={true} value={confirmPassword} onChangeText={text => this.onChangeText('confirmPassword', text)} style={styles.textInput} placeholder="Confirm password" />
          <Button title="Sign up" onPress={this.submit} />
        </View>
      </View>
    )
  }
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
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  textInput: {
    fontSize: 16,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1
  }
});

const SIGNUP_MUTATION = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
      }
      error {
        path
        message
      }
    }
  } 
`;

export default graphql(SIGNUP_MUTATION)(Signup);
