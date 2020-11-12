import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import { loginSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class Login extends React.PureComponent {
  state = {
    values: {
      email: '',
      password: '',
    },
    errors: {},
    isSubmitting: false,
    loading: false
  }

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await loginSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { email, password }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { login: { errors, user, token } } } = await this.props.mutate({ variables: { email, password } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        AsyncStorage.setItem('@kemetsehaftalem/token', token)
        console.log("Resp: ", user, token)
        this.props.history.push('/')
      }
    }
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value
      },
      errors,
      isSubmitting: false
    }))
  }

  redirectToSignupPage = () => {
    this.props.history.push('/')
  }

  render() {
    const { values: { email, password }, loading, isSubmitting, errors } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title} h2>Login</Text>
        <View style={styles.loginContainer}>
          <Input value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: 'red' }}
            errorMessage={errors.email} leftIcon={{ type: 'font-awesome', name: 'envelope', size: 15, marginRight: 10 }} />
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} placeholder="Password" errorStyle={{ color: 'red' }}
            errorMessage={errors.password} leftIcon={{ type: 'font-awesome', name: 'lock', size: 20, marginRight: 10 }} />
          <Button
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="sign-in"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
            onPress={this.submit} disabled={isSubmitting}
            title="Sign up"
          />
          <Divider style={{ marginTop: 30, marginBottom: 30 }} />
          <Button
            type="outline"
            icon={
              <Icon
                name="user-plus"
                size={20}
                style={{ marginRight: 10 }}
                color='steelblue'
              />
            }
            onPress={this.redirectToSignupPage}
            title="Not have an account?"
          />
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
    paddingHorizontal: 50,
    paddingVertical: 200
  },
  loginContainer: {
    marginTop: 10
  },
  title: {
    textAlign: 'center',
  }
});

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        email
        phone
      }
      errors {
        path
        message
      }
    }
  } 
`;

export default graphql(LOGIN_MUTATION)(Login);
