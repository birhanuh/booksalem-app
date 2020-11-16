import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import { signupSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class CreateAccount extends React.PureComponent {
  state = {
    values: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
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
      await signupSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      console.log("Resp: ", formatYupErrors(err))
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { name, email, password, phone }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { signup: { errors, user, token } } } = await this.props.mutate({ variables: { name, email, password, phone } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        AsyncStorage.setItem('@kemetsehaftalem/token', token)
        console.log("Resp: ", user, token)
        this.props.navigation.push('Books')
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

  render() {
    const { values: { name, email, password, confirmPassword, phone }, loading, isSubmitting, errors } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title} h2>Create account</Text>
        <View style={styles.signupContainer}>
          <Input value={name} onChangeText={text => this.onChangeText('name', text)} placeholder="Name" errorStyle={{ color: 'red' }}
            errorMessage={errors.name} />
          <Input value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: 'red' }}
            errorMessage={errors.email} />
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} placeholder="Password" errorStyle={{ color: 'red' }}
            errorMessage={errors.password} />
          <Input secureTextEntry={true} value={confirmPassword} onChangeText={text => this.onChangeText('confirmPassword', text)} placeholder="Confirm password" errorStyle={{ color: 'red' }}
            errorMessage={errors.confirmPassword} />
          <Input value={phone} onChangeText={text => this.onChangeText('phone', text)} autoCapitalize="none" placeholder="Phone" errorStyle={{ color: 'red' }}
            errorMessage={errors.phone} />
          <Button
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="user-plus"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
            onPress={this.submit} disabled={isSubmitting}
            title="Create account"
          />

          <Divider style={{ marginTop: 30, marginBottom: 30 }} />

          <Button
            type="outline"
            icon={
              <Icon
                name="sign-in"
                size={20}
                style={{ marginRight: 10 }}
                color='steelblue'
              />
            }
            onPress={() => { this.props.navigation.push('SignIn') }}
            title="Sign in"
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
  signupContainer: {
    marginTop: 10
  },
  title: {
    textAlign: 'center',
  }
});

const SIGNUP_MUTATION = gql`
  mutation($name: String!, $email: String!, $password: String!, $phone: String) {
    signup(name: $name, email: $email, password: $password, phone: $phone) {
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

export default graphql(SIGNUP_MUTATION)(CreateAccount);
