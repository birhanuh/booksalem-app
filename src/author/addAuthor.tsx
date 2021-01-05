import React, { PureComponent } from 'react'
import { View } from 'react-native';
import { Card, Text, Input, Button, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql, ChildProps } from '@apollo/react-hoc';
import { addAuthorSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';
import GET_AUTHORS from './authors.graphql';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
  route: NavigationScreenProp<any, any> | any;
  navigation: NavigationScreenProp<any, any> | any;
}

interface Mutate {
  mutate: (variables: any) => Promise<any | null>;
}

interface State {
  name: string;
  errors: { [key: string]: string } | Record<string, unknown>;
  isSubmitting: boolean;
}

class AddAuthor extends PureComponent<ChildProps<Props & Mutate>, State> {
  state = {
    name: '',
    isSubmitting: false,
    errors: {
      addAuthor: '',
      name: ''
    }
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

          // Read the data from cache for this query.
          const data = store.readQuery({ query: GET_AUTHORS });

          // Add author from the mutation to the end.  
          const getAuthorsUpdated = [author, ...data.getAuthors];

          // Write data back to the cache.
          store.writeQuery({ query: GET_AUTHORS, data: { getAuthors: getAuthorsUpdated } });
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
    const errors = Object.assign({}, this.state.errors);
    delete errors[key];

    this.setState({ name: value, errors, isSubmitting: false })
  }

  render() {
    const { name, isSubmitting, errors } = this.state

    return (
      <Card>
        {/* Error message */}
        {errors.addAuthor && <View style={{ backgroundColor: colors.error }}><Text style={{ color: 'white' }}>{errors.addAuthor}</Text></View>}

        <Input value={name} onChangeText={text => this.onChangeText('name', text)} placeholder="Author" errorStyle={{ color: colors.error }}
          errorMessage={errors.name} />

        <Button
          title="Add"
          icon={
            <Icon
              name="plus-circle"
              size={20}
              style={{ marginRight: 10 }}
              color='white'
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

export default graphql<ChildProps<Props>>(ADD_AUTHOR_MUTATION)(AddAuthor);

