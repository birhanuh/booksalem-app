import React from 'react';
import { View, TextInput, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { ReactNativeFile } from "apollo-upload-client";
import { Picker } from '@react-native-picker/picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Image, colors } from 'react-native-elements';
import { graphql, gql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { addBookSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';

class AddBook extends React.PureComponent {
  state = {
    values: {
      title: '',
      author: '',
      published_date: '',
      status: 'available',
      condition: 'new',
      isbn: null,
      categoryId: 1,
      languageId: 1,
      price: '',
      description: '',
      coverFile: null
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

    const { values: { title, author, published_date, status, condition, isbn, categoryId, languageId, price, description, coverFile }, errors } = this.state

    let coverFileWraped
    if (!!coverFile) {
      const tokens = coverFile.uri.split('/');
      const name = tokens[tokens.length - 1];

      coverFileWraped = new ReactNativeFile({
        uri: coverFile.uri,
        type: coverFile.type,
        name
      })
    }

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors, isSubmitting: false })
    } else {
      this.setState({ isSubmitting: true })

      const { data: { addBook: { book, errors } } } = await this.props.addBookMutation({ variables: { title, author, published_date, status, condition, isbn: parseInt(isbn), categoryId, languageId, price: parseFloat(price), description, coverFile: coverFileWraped } })
      console.log("Resp data: ", book, errors)
      if (errors) {
        this.setState({ errors: formatServerErrors(errors) })
      } else {
        this.props.history.push(`/book/view/${book.id}`)
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

  redirectToLoginPage = () => {
    this.props.history.push('/login')
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  pickImage = async () => {
    let result = await launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3] });

    if (!result.cancelled) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors);
      delete errors["coverFile"];

      this.setState({ values: { ...this.state.values, coverFile: result }, errors })
    }
  }

  render() {
    const { values: { title, author, published_date, status, condition, isbn, categoryId, languageId, price, description, coverFile }, loading, isSubmitting, errors } = this.state
    const { getCategoriesQuery: { getCategories }, getLanguagesQuery: { getLanguages } } = this.props

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
          <Text style={styles.title} h2>Add book</Text>
          {/* Error message */}
          {errors.addBook && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.addBook}</Text></View>}

          <View style={styles.signupContainer}>
            <Input value={title} onChangeText={text => this.onChangeText('title', text)} placeholder="Title" errorStyle={{ color: colors.error }}
              errorMessage={errors.title} />
            <Input value={author} onChangeText={text => this.onChangeText('author', text)} placeholder="Author" errorStyle={{ color: colors.error }}
              errorMessage={errors.author} />
            <View>
              <Text style={styles.pickerTitle}>Status</Text>
              <Picker
                itemStyle={styles.picker}
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ values: { ...this.state.values, status: itemValue } })
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
                  this.setState({ values: { ...this.state.values, condition: itemValue } })
                }>
                <Picker.Item label="New" value="new" />
                <Picker.Item label="Used" value="used" />
                <Picker.Item label="Old" value="old" />
              </Picker>
            </View>
            <Input value={published_date} onChangeText={text => this.onChangeText('published_date', text)} placeholder="Published date ( Optional )" errorStyle={{ color: colors.error }}
              errorMessage={errors.published_date} />
            <Input value={isbn} onChangeText={text => this.onChangeText('isbn', text)} placeholder="ISBN" errorStyle={{ color: colors.error }}
              errorMessage={errors.isbn} />
            <View>
              <Text style={styles.pickerTitle}>Category</Text>
              <Picker
                itemStyle={styles.picker}
                selectedValue={categoryId}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ values: { ...this.state.values, categoryId: itemValue } })
                }>
                {getCategories && getCategories.map(category =>
                  <Picker.Item key={category.id} label={this.capitalizeFirstLetter(category.name)} value={category.id} />)}
              </Picker>
              {errors.categoryId && <Text style={styles.cutomeTextError}>{errors.categoryId}</Text>}
            </View>
            <View>
              <Text style={styles.pickerTitle}>Language</Text>
              <Picker
                itemStyle={styles.picker}
                selectedValue={languageId}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ values: { ...this.state.values, languageId: itemValue } })
                }>
                {getLanguages && getLanguages.map(language =>
                  <Picker.Item key={language.id} label={this.capitalizeFirstLetter(language.name)} value={language.id} />)}
              </Picker>
              {errors.languageId && <Text style={styles.cutomeTextError}>{errors.languageId}</Text>}
            </View>
            <Input value={price} onChangeText={text => this.onChangeText('price', text)} placeholder="price" errorStyle={{ color: colors.error }}
              errorMessage={errors.price} />
            <View style={{ flex: 1 }}>
              <Text style={styles.uploadPictureTitle}>Upload picture</Text>
              <Button
                type="outline"
                icon={
                  <Icon
                    name="picture-o"
                    size={20}
                    style={{ marginRight: 10 }}
                    color={colors.primary}
                  />
                }
                onPress={this.pickImage}
                title="Choose image"
                style={{ alignSelf: 'center', marginBottom: 10 }}
              />
              {errors.coverFile && <Text style={styles.cutomeTextError}>{errors.coverFile}</Text>}
              {!!coverFile && <Image source={{ uri: coverFile.uri }} style={styles.image} PlaceholderContent={<ActivityIndicator />} />}
            </View>
            <TextInput
              style={styles.description}
              value={description}
              multiline={true}
              numberOfLines={4}
              onChangeText={text => this.onChangeText('description', text)} placeholder="Description" errorStyle={{ color: colors.error }} />

            <Divider style={{ marginTop: 20, marginBottom: 20 }} />

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
          </View>
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
  uploadPictureTitle: {
    fontSize: 18,
    color: colors.grey3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
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
  },
  image: {
    minWidth: 360,
    height: 200,
    marginBottom: 10
  },
  cutomeTextError: {
    color: colors.error,
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: -5
  }
});

const ADD_BOOK_MUTATION = gql`
  mutation($title: String!, $author: String!, $published_date: String, $status: String!, $condition: String!, $isbn: Int, $categoryId: Int!, $languageId: Int!, $price: Float!, $coverFile: Upload, $description: String) {
    addBook(title: $title, author: $author, published_date: $published_date, status: $status, condition: $condition, isbn: $isbn, categoryId: $categoryId, languageId: $languageId, price: $price, coverFile: $coverFile, description: $description) {
    book {
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
