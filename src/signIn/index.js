import React from 'react';
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Card, Divider, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import { signInSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class SignIn extends React.PureComponent {
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
      await signInSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { email, password }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ isSubmitting: true })
    } else {
      const { data: { signIn: { errors, user, token } } } = await this.props.mutate({ variables: { email, password } })
      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        AsyncStorage.setItem('@kemetsehaftalem/token', token)
        console.log("Resp: ", user, token)
        this.props.navigation.navigate('Books', { screen: 'Books', params: { me: user } })
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
    const { values: { email, password }, loading, isSubmitting, errors } = this.state

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title} h2>Sign In</Text>
        <Card style={styles.card}>
          <Input value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: colors.error }}
            errorMessage={errors.email} leftIcon={{ type: 'font-awesome', name: 'envelope', size: 15, marginRight: 10 }} />
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} placeholder="Password" errorStyle={{ color: colors.error }}
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
            title="Sign in"
          />
        </Card>

        <Divider style={{ marginTop: 30, marginBottom: 30 }} />

        <View style={styles.btnContainer} >
          <Button
            type="outline"
            icon={
              <Icon
                name="user-plus"
                size={20}
                style={{ marginRight: 10 }}
                color={colors.primary}
              />
            }
            onPress={() => { this.props.navigation.push('CreateAccount') }}
            title="Don't have an account?"
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
    paddingVertical: 100
  },
  btnContainer: {
    paddingHorizontal: 16
  },
  card: {
    shadowColor: colors.divider,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
  }
});

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
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

export default graphql(LOGIN_MUTATION)(SignIn);
