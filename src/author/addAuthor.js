import React, { useState } from 'react'
import { View } from 'react-native';
import { Card, Text, Input, Button, colors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { graphql, gql } from '@apollo/react-hoc';
import { addAuthorSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

let nameLoc = ''

const AddAuthor = ({ mutate, navigateToAddBook }) => {
  const [name, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = async () => {
    if (isSubmitting) {
      return
    }

    // Validation
    let errorsLoc = {}
    try {
      await addAuthorSchema.validate({ name }, { abortEarly: false })
    } catch (err) {
      errorsLoc = err
      setErrors(formatYupErrors(err))
    }

    if (Object.keys(errorsLoc).length === 0) {
      setIsSubmitting(true)

      const { data: { addAuthor: { author, errors } } } = await mutate({ variables: { name: nameLoc } })
      console.log("Resp data: ", author, errors)
      if (errors) {
        setErrors(formatServerErrors(errors))
      } else {
        navigateToAddBook();
      }
    }
  }

  const onChangeText = (key, value) => {
    // Clone errors form state to local variable
    let errors = Object.assign({}, errors);
    delete errors[key];

    nameLoc = value

    setErrors(errors)
    setAuthor(value)
    setIsSubmitting(false)
  }

  return (
    <Card>
      {/* Error message */}
      {errors.addAuthor && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.addAuthor}</Text></View>}

      <Input value={name} onChangeText={text => onChangeText('name', text)} placeholder="Author" errorStyle={{ color: colors.error }}
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
        onPress={submit}
        disabled={isSubmitting}
      />
    </Card>
  )
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

