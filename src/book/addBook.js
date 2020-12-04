import React, { PureComponent } from 'react';
import { View, TextInput, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { ReactNativeFile } from "apollo-upload-client";
import { Picker } from '@react-native-picker/picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Image, colors } from 'react-native-elements';
import { graphql } from '@apollo/react-hoc';
import compose from "lodash.flowright";
import { addBookSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';
import ADD_BOOK_MUTATION from './addBook.graphql';
import GET_LANGUAGES_QUERY from './languages.graphql';
import GET_CATEGORIES_QUERY from './categories.graphql';
import GET_AUTHORS_QUERY from '../author/authors.graphql';
import GET_AVAILABLE_BOOKS from './availableBooks.graphql';

class AddBook extends PureComponent {
  state = {
    values: {
      title: '',
      authorId: '',
      publishedDate: '',
      status: 'available',
      type: 'rent',
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

    const { values: { title, authorId, publishedDate, type, status, condition, isbn, categoryId, languageId, price, description, coverFile }, errors } = this.state

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

    if (Object.keys(errors).length === 0) {
      this.setState({ isSubmitting: true })

      this.props.addBookMutation({
        variables: {
          title, authorId, publishedDate, type, status, condition, isbn: parseInt(isbn), categoryId, languageId, price: parseFloat(price),
          description, coverFile: coverFileWraped
        }, update: (store, { data: { addBook } }) => {
          const { book, errors } = addBook;

          if (errors) {
            return;
          }

          // Read the data from cache for this query.
          const data = store.readQuery({ query: GET_AVAILABLE_BOOKS });

          // Add book from the mutation to the end.            
          // data.getAvailableBooks.unshift(book);       
          const getAvailableBooksUpdated = [book, ...data.getAvailableBooks];

          // Write data back to the cache.
          store.writeQuery({ query: GET_AVAILABLE_BOOKS, data: { getAvailableBooks: getAvailableBooksUpdated } });
        }
      }).then(res => {
        const { book, errors } = res.data.addBook;

        console.log("Resp data: ", book, errors)
        if (errors) {
          this.setState({ errors: formatServerErrors(errors) })
        } else {
          this.props.navigation.navigate('ViewBook', { name: 'View book', id: book.id })
        }
      }).catch(err => this.setState({ errors: err, isSubmitting: false }));
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
    const { values: { title, authorId, publishedDate, type, status, condition, isbn, categoryId, languageId, price, description, coverFile }, loading, isSubmitting, errors } = this.state
    const { getAuthorsQuery: { getAuthors }, getCategoriesQuery: { getCategories }, getLanguagesQuery: { getLanguages } } = this.props

    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    };

    return (
      <ScrollView>
        <View style={styles.container}>
          {/* Error message */}
          {errors.addBook && <View style={{ backgroundColor: colors.error }}><Text color="white">{errors.addBook}</Text></View>}

          <Input value={title} onChangeText={text => this.onChangeText('title', text)} placeholder="Title" errorStyle={{ color: colors.error }}
            errorMessage={errors.title} />
          <View style={styles.authorContainer}>
            <Text style={styles.authorTitle}>Select author or add a new one</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={authorId}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, authorId: itemValue } })
              }>
              {getAuthors && getAuthors.map(author =>
                <Picker.Item key={author.id} label={this.capitalizeFirstLetter(author.name)} value={author.id} />)}
            </Picker>
            {errors.authorId && <Text style={styles.customTextError}>{errors.authorId}</Text>}
            <Button
              title='Add author'
              type='outline'
              icon={
                <Icon
                  name="plus-circle"
                  size={20}
                  style={{ marginRight: 10 }}
                  color={colors.primary}
                />
              }
              onPress={() => { this.props.navigation.navigate('Authors', { params: { name: 'Add author', referrer: 'AddBook' } }) }}
            />
          </View>
          <View>
            <Text style={styles.pickerTitle}>Type (Is is to for Sell or Rent)</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={type || book.type}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, status: itemValue } })
              }>
              <Picker.Item label="Rent" value="rent" />
              <Picker.Item label="Sell" value="sell" />
            </Picker>
          </View>
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
          <Input value={publishedDate} onChangeText={text => this.onChangeText('publishedDate', text)} placeholder="Published date ( Optional )" errorStyle={{ color: colors.error }}
            errorMessage={errors.publishedDate} />
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
            {errors.categoryId && <Text style={styles.customTextError}>{errors.categoryId}</Text>}
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
            {errors.languageId && <Text style={styles.customTextError}>{errors.languageId}</Text>}
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
            {errors.coverFile && <Text style={styles.customTextError}>{errors.coverFile}</Text>}
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
  authorContainer: {
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  authorTitle: {
    fontSize: 18,
    color: colors.grey3,
    marginHorizontal: 10,
    marginBottom: 18
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
  customTextError: {
    color: colors.error,
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: -5
  }
});

const MutationQueries = compose(
  graphql(ADD_BOOK_MUTATION, {
    name: "addBookMutation"
  }),
  graphql(GET_CATEGORIES_QUERY, {
    name: "getCategoriesQuery"
  }),
  graphql(GET_LANGUAGES_QUERY, {
    name: "getLanguagesQuery"
  }),
  graphql(GET_AUTHORS_QUERY, {
    name: "getAuthorsQuery",
    options: () => ({
      fetchPolicy: "network-only"
    })
  })
)(AddBook);

export default MutationQueries;
