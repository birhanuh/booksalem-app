import React from 'react';
import { Text, View, SafeAreaView, ActivityIndicator, Image, StyleSheet, TextInput, Button } from 'react-native';
import { graphql, gql } from '@apollo/react-hoc';
import { registrationSchema } from '../utils/validationSchema';
import { formatYupError } from '../utils/formatError';

const defaultState = {
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

class Signup extends React.PureComponent {
  state = defaultState;

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await registrationSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupError(err) })
      console.log("STATE: ", formatYupError(err))
    }

    this.setState({ isSubmitting: true })
    const { name, email, password } = this.state.values

    const { data: { errors, user, token } } = await this.props.mutate({ variables: { name, email, password } })


    if (errors) {
      this.setState({ errors, isSubmitting: false })
      return
    }

    console.log("Resp: ", user, token)
    this.setState(defaultState)

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
      errors
    }))
  }

  render() {
    const { values: { name, email, password, confirmPassword }, loading, isSubmitting, errors } = this.state
    console.log("DDD: ", errors.name)
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
          <TextInput value={name} onChangeText={text => this.onChangeText('name', text)} style={styles.textInput} placeholder="Name" errorStyle={{ color: 'red' }}
            errorMessage={errors.name && 'ENTER A VALID ERROR HERE'} />
          <TextInput value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" style={styles.textInput} placeholder="Email" errorStyle={{ color: 'red' }}
            errorMessage={errors.email && 'ENTER A VALID ERROR HERE'} />
          <TextInput secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} style={styles.textInput} placeholder="Password" errorStyle={{ color: 'red' }}
            errorMessage={errors.password && 'ENTER A VALID ERROR HERE'} />
          <TextInput secureTextEntry={true} value={confirmPassword} onChangeText={text => this.onChangeText('confirmPassword', text)} style={styles.textInput} placeholder="Confirm password" errorStyle={{ color: 'red' }}
            errorMessage={errors.confirmPassword && 'ENTER A VALID ERROR HERE'} />
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
      errors {
        path
        message
      }
    }
  } 
`;

export default graphql(SIGNUP_MUTATION)(Signup);
