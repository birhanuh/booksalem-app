import React from 'react';
import { View, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import { signupSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class User extends React.PureComponent {
  state = {
    values: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
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
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { name, email, password, phone }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { updateUser: { errors, user } } } = await this.props.mutate({ variables: { name, email, password, phone } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        console.log("Resp: ", user, token)
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
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titleSecondary} h4>Profile</Text>
          <Input value={name} onChangeText={text => this.onChangeText('name', text)} placeholder="Name" errorStyle={{ color: colors.error }}
            errorMessage={errors.name} />
          <Input value={email} onChangeText={text => this.onChangeText('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: colors.error }}
            errorMessage={errors.email} />
          <Input value={phone} onChangeText={text => this.onChangeText('phone', text)} autoCapitalize="none" placeholder="Phone" errorStyle={{ color: colors.error }}
            errorMessage={errors.phone} />
          <Button
            type="outline"
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="user-plus"
                size={20}
                style={{ marginRight: 10 }}
                color='steelblue'
              />
            }
            onPress={this.submit} disabled={isSubmitting}
            title="Update profile"
          />

          <Divider style={{ marginTop: 30, marginBottom: 20 }} />

          <Text style={styles.titleSecondary} h4>Password</Text>
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangeText('password', text)} placeholder="Password" errorStyle={{ color: colors.error }}
            errorMessage={errors.password} />
          <Input secureTextEntry={true} value={confirmPassword} onChangeText={text => this.onChangeText('confirmPassword', text)} placeholder="Confirm password" errorStyle={{ color: colors.error }}
            errorMessage={errors.confirmPassword} />
          <Button
            type="outline"
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="user-plus"
                size={20}
                style={{ marginRight: 10 }}
                color='steelblue'
              />
            }
            onPress={this.submit} disabled={isSubmitting}
            title="Update password"
          />
        </View>
      </ScrollView>
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
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 16,
    marginHorizontal: 16
  },
  titleSecondary: {
    marginBottom: 10,
  }
});

const USER_UPDATE_MUTATION = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    user(name: $name, email: $email, password: $password) {
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

export default graphql(USER_UPDATE_MUTATION)(User);
