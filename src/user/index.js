import React from 'react';
import { View, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { profileSchema, passwordSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class User extends React.PureComponent {
  state = {
    profile: {
      name: '',
      email: '',
      phone: ''
    },
    password: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    disablePasswordChange: true,
    errors: {},
    isSubmitting: false,
    loading: false
  }

  componentDidMount() {
    const { me: { name, email, phone } } = this.props.getMeQuery;

    this.setState(state => ({
      profile: {
        name,
        email,
        phone
      },
    }))
  }

  updateProfile = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await profileSchema.validate(this.state.profile, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { profile: { name, email, phone }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { updateProfile: { errors, user } } } = await this.props.updateProfileMutation({ variables: { name, email, phone } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        console.log("Resp: ", user)
      }
    }
  }

  updatePassword = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await passwordSchema.validate(this.state.password, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { password: { newPassword }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { updatePassword: { errors, user } } } = await this.props.updatePasswordMutation({ variables: { password: newPassword } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        console.log("Resp: ", user, token)
      }
    }
  }

  onChangeProfile = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState(state => ({
      profile: {
        ...state.profile,
        [key]: value
      },
      errors,
      isSubmitting: false
    }))
  }

  onChangeNewPasword = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState(state => ({
      password: {
        ...state.password,
        [key]: value
      },
      errors,
      isSubmitting: false
    }))
  }

  onChangePasword = async (key, value) => {
    // Clone errors form state to local variable
    let errorsCloned = Object.assign({}, this.state.errors);
    delete errorsCloned[key];

    this.setState(state => ({
      password: {
        ...state.password,
        [key]: value
      },
      errors: errorsCloned
    }))

    const { data: { checkPassword: { user, errors } } } = await this.props.checkPasswordMutation({ variables: { password: value } })

    if (errors) {
      this.setState({ errors: formatServerErrors(errors) })
    } else {
      this.setState(state => ({
        disablePasswordChange: false
      }))
    }
  }

  render() {
    const { profile: { name, email, phone }, password: { password, newPassword, confirmNewPassword }, disablePasswordChange, loading, isSubmitting, errors } = this.state

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
          <Input value={name} onChangeText={text => this.onChangeProfile('name', text)} placeholder="Name" errorStyle={{ color: colors.error }}
            errorMessage={errors.name} />
          <Input value={email} onChangeText={text => this.onChangeProfile('email', text)} autoCapitalize="none" placeholder="Email" errorStyle={{ color: colors.error }}
            errorMessage={errors.email} />
          <Input value={phone} onChangeText={text => this.onChangeProfile('phone', text)} autoCapitalize="none" placeholder="Phone" errorStyle={{ color: colors.error }}
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
            onPress={this.updateProfile} disabled={isSubmitting}
            title="Update profile"
          />

          <Divider style={{ marginTop: 30, marginBottom: 20 }} />

          <Text style={styles.titleSecondary} h4>Password</Text>
          <Input secureTextEntry={true} value={password} onChangeText={text => this.onChangePasword('password', text)} placeholder="Current password" errorStyle={{ color: colors.error }}
            errorMessage={errors.password} />
          <Input secureTextEntry={true} value={newPassword} disabled={disablePasswordChange} onChangeText={text => this.onChangeNewPasword('newPassword', text)} placeholder="New password" errorStyle={{ color: colors.error }}
            errorMessage={errors.newPassword} />
          <Input secureTextEntry={true} value={confirmNewPassword} disabled={disablePasswordChange} onChangeText={text => this.onChangeNewPasword('confirmNewPassword', text)} placeholder="Confirm new password" errorStyle={{ color: colors.error }}
            errorMessage={errors.confirmNewPassword} />
          <Button
            type="outline"
            style={{ marginTop: 20 }}
            icon={
              <Icon
                name="user-plus"
                size={20}
                style={{ marginRight: 10 }}
                color={isSubmitting || disablePasswordChange ? colors.disabled : 'steelblue'}
              />
            }
            onPress={this.updatePassword} disabled={isSubmitting || disablePasswordChange}
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

const GET_ME_QUERY = gql`
  query {
    me {
      name
      email
      phone
    }
  }
`

const UPDATE_PROFIEL_MUTATION = gql`
  mutation($name: String!, $email: String!, $phone: String) {
    updateProfile(name: $name, email: $email, phone: $phone) {
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

const UPDATE_PASSWORD_MUTATION = gql`
  mutation($password: String!) {
    updatePassword(password: $password) {
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

const CHECK_PASSWORD_MUTATION = gql`
  mutation($password: String!) {
    checkPassword(password: $password) {
      user {
        name
      }
      errors {
        path
        message
      }
    }
  }
`

const MutationsQuery = compose(
  graphql(UPDATE_PROFIEL_MUTATION, {
    name: "updateProfileMutation"
  }),
  graphql(UPDATE_PASSWORD_MUTATION, {
    name: "updatePasswordMutation"
  }),
  graphql(CHECK_PASSWORD_MUTATION, {
    name: "checkPasswordMutation"
  }),
  graphql(GET_ME_QUERY, {
    name: "getMeQuery"
  })
)(User);

export default MutationsQuery;
