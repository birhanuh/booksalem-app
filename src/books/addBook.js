import React from 'react';
import { View, TextInput, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { signupSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class AddBook extends React.PureComponent {
  state = {
    values: {
      title: '',
      author: '',
      published_date: '',
      status: '',
      condition: '',
      isbn: undefined,
      category: '',
      language: '',
      price: '',
      description: ''
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
      await addBookSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { title, author, published_date, status, condition, isbn, category, language, price, description }, errors } = this.state

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      /** 
      const { data: { addBook: { books: { id, title }, errors } } } = await this.props.addBookMutation({ variables: { title, author, published_date, status, condition, isbn, category, language, price, description } })

      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        useAsyncStorage.setItem('@kemetsehaftalem/token', token)
        console.log("Resp: ", user, token)
        this.props.history.push('/')
      }
      */
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

  redirectToLoginPage = () => {
    this.props.history.push('/login')
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { values: { title, author, published_date, status, condition, isbn, category, language, price, description }, loading, isSubmitting, errors } = this.state
    const { getCategoriesQuery: { getCategories }, getLanguagesQuery: { getLanguages } } = this.props

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator />
        </SafeAreaView>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title} h2>Add b ook</Text>
        {/* Error message */}
        {errors.addBook && <View style={{ backgroundColor: '#EC3C3E' }}><Text color="white">{errors.addBook}</Text></View>}

        <View style={styles.signupContainer}>
          <Input value={title} onChangeText={text => this.onChangeText('title', text)} placeholder="Title" errorStyle={{ color: 'red' }}
            errorMessage={errors.title} />
          <Input value={author} onChangeText={text => this.onChangeText('author', text)} placeholder="Author" errorStyle={{ color: 'red' }}
            errorMessage={errors.author} />
          <View>
            <Text style={styles.pickerTitle}>Status</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={status}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { status: itemValue } })
              }>
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Ordered" value="ordered" />
              <Picker.Item label="Rented" value="rented" />
              <Picker.Item label="Sold" value="sold" />
            </Picker>
          </View>
          <View>
            <Text style={styles.pickerTitle}>Condition</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={condition}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { condition: itemValue } })
              }>
              <Picker.Item label="New" value="new" />
              <Picker.Item label="Used" value="used" />
              <Picker.Item label="Old" value="old" />
            </Picker>
          </View>
          <Input value={published_date} onChangeText={text => this.onChangeText('published_date', text)} placeholder="Published date ( 01.12.2016 )" errorStyle={{ color: 'red' }}
            errorMessage={errors.published_date} />
          <Input value={isbn} onChangeText={text => this.onChangeText('isbn', text)} placeholder="ISBN" errorStyle={{ color: 'red' }}
            errorMessage={errors.isbn} />
          <View>
            <Text style={styles.pickerTitle}>Category</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={category}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { category: itemValue } })
              }>
              {getCategories.map(category =>
                <Picker.Item key={category.id} label={this.capitalizeFirstLetter(category.name)} value={category.id} />)}
            </Picker>
          </View>
          <View>
            <Text style={styles.pickerTitle}>Language</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={language}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { language: itemValue } })
              }>
              {getLanguages.map(language =>
                <Picker.Item key={language.id} label={this.capitalizeFirstLetter(language.name)} value={language.id} />)}
            </Picker>
          </View>
          <Input value={price} onChangeText={text => this.onChangeText('price', text)} placeholder="price" errorStyle={{ color: 'red' }}
            errorMessage={errors.price} />
          <TextInput
            style={styles.description}
            value={description}
            multiline={true}
            numberOfLines={4}
            onChangeText={text => this.onChangeText('description', text)} placeholder="Description" errorStyle={{ color: 'red' }} />

          <Divider style={{ marginTop: 20, marginBottom: 20 }} />

          <Button
            type="outline"
            icon={
              <Icon
                name="plus-circle"
                size={20}
                style={{ marginRight: 10 }}
                color='steelblue'
              />
            }
            onPress={this.redirectToLoginPage}
            title="Add"
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
    paddingHorizontal: 20,
    paddingVertical: 100
  },
  signupContainer: {
    marginTop: 10
  },
  title: {
    textAlign: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10
  },
  description: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  picker: {
    marginTop: -40,
    height: 160,
    marginLeft: 10,
    marginRight: 10
  }
});

const ADD_BOOK_MUTATION = gql`
  mutation($title: String!, $author: String!, $published_date: DateTime!, $status: String!, $condition: String!, $isbn: Int, $categoryId: Int!, $languageId: Int!, $price: Float!, $cover_url: String!, $description: String) {
    addBook(title: $title, author: $author, published_date: $published_date, status: $status, condition: $condition, isbn: $isbn, categoryId: $categoryId, languageId: $languageId, price: $price, cover_url: $cover_url, description: $description) {
    books {
      id
      title
    }
      errors {
        path
        message
      }
    }
  }
`;

const GET_LANGUAGES_QUERY = gql`
  query {
    getLanguages {
      id
      name
    }
  }
`

const GET_CATEGORIESS_QUERY = gql`
  query {
    getCategories {
      id
      name
    }
  }
`

const MutationsQuery = compose(
  graphql(ADD_BOOK_MUTATION, {
    name: "addBookMutation"
  }),
  graphql(GET_CATEGORIESS_QUERY, {
    name: "getCategoriesQuery"
  }),
  graphql(GET_LANGUAGES_QUERY, {
    name: "getLanguagesQuery"
  })
)(AddBook);

export default MutationsQuery;
