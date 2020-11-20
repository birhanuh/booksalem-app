import React, { useState } from 'react'
import { View } from 'react-native';
import { Card, Text, Input, Button, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql } from '@apollo/react-hoc';
import { addAuthorSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

let authorLoc = ''

const AddAuthor = ({ mutate, navigation, referrer }) => {
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  submit = async () => {
    if (isSubmitting) {
      return
    }

    // Validation
    let errorsLoc = {}
    try {
      await addAuthorSchema.validate({ author }, { abortEarly: false })
    } catch (err) {
      errorsLoc = err
      setErrors(formatYupErrors(err))
    }

    if (Object.keys(errorsLoc).length === 0) {
      setIsSubmitting(true)

      const { data: { addAuthor: { author, errors } } } = await mutate({ variables: { author: authorLoc } })
      console.log("Resp data: ", author, errors)
      if (errors) {
        setErrors(formatServerErrors(errors))
      } else {
        if (referrer) {
          navigation.push(referrer)
        }
      }
    }
  }

  const onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, errors);
    delete errors[key];

    authorLoc = value

    setErrors(errors)
    setAuthor(value)
    setIsSubmitting(false)
  }

  return (
    <Card>
      {/* Error message */}
      {errors.addAuthor && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.addAuthor}</Text></View>}

      <Input value={author} onChangeText={text => onChangeText('author', text)} placeholder="Author" errorStyle={{ color: colors.error }}
        errorMessage={errors.author} />

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
        onPress={submit}
        disabled={isSubmitting}
      />
    </Card>
  )
}

const ADD_AUTHOR_MUTATION = gql`
  mutation($author: String!) {
    addAuthor(author: $author) {
      author {
        author
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(ADD_AUTHOR_MUTATION)(AddAuthor);

