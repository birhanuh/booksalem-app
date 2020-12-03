import React, { PureComponent } from 'react'
import { View } from 'react-native';
import { Card, Text, Input, Button, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql } from '@apollo/react-hoc';
import { addAuthorSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';
import GET_AUTHORS from './authors.graphql';

class AddAuthor extends PureComponent {
  state = {
    name: '',
    isSubmitting: false,
    errors: {}
  }

  submit = async () => {
    const { name, isSubmitting, errors } = this.state

    if (isSubmitting) {
      return
    }

    // Validation
    try {
      await addAuthorSchema.validate({ name }, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    if (Object.keys(errors).length === 0) {
      this.setState({ isSubmitting: false })

      const { data: { addAuthor: { author, errors } } } = await this.props.mutate({
        variables: { name }, update: (store, { data: { addAuthor } }) => {
          const { author, errors } = addAuthor;

          if (errors) {
            return;
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_AUTHORS });

          // Add our author from the mutation to the end.
          // data.getAuthors.unshift(author);

          // Write our data back to the cache.
          store.writeQuery({ query: GET_AUTHORS, data });
        },
      })

      console.log("Resp data: ", author, errors)
      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        this.setState({ name: '', isSubmitting: false })

        if (this.props.route.params && this.props.route.params.params.referrer) {
          this.props.navigation.navigate(this.props.route.params.params.referrer)
        }
      }

    }
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, errors);
    delete errors[key];

    this.setState({ name: value, errors, isSubmitting: false })
  }

  render() {
    const { name, isSubmitting, errors } = this.state

    return (
      <Card>
        {/* Error message */}
        {errors.addAuthor && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.addAuthor}</Text></View>}

        <Input value={name} onChangeText={text => this.onChangeText('name', text)} placeholder="Author" errorStyle={{ color: colors.error }}
          errorMessage={errors.name} />

        <Button
          title="Add"
          icon={
            <Icon
              name="plus-circle"
              size={20}
              style={{ marginRight: 10 }}
              color={colors.white}
            />
          }
          onPress={this.submit}
          disabled={isSubmitting}
        />
      </Card>
    )
  }
}

const ADD_AUTHOR_MUTATION = gql`
  mutation($name: String!) {
    addAuthor(name: $name) {
      author {
        name
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(ADD_AUTHOR_MUTATION)(AddAuthor);

