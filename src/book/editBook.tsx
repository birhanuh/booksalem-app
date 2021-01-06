import React from 'react';
import { View, TextInput, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { ReactNativeFile } from "apollo-upload-client";
import { Picker } from '@react-native-picker/picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, Divider, Image, colors } from 'react-native-elements';
import { graphql } from '@apollo/client/react/hoc';
import compose from "lodash.flowright";
import { updateBookSchema } from '../utils/validationSchema';
import { formatYupErrors, formatServerErrors } from '../utils/formatError';
import UPDATE_BOOK_MUTATION from './updateBook.graphql';
import GET_LANGUAGES_QUERY from './languages.graphql';
import GET_CATEGORIES_QUERY from './categories.graphql';
import GET_AUTHORS_QUERY from '../author/authors.graphql';
import GET_AVAILABLE_BOOKS from './availableBooks.graphql';
import { NavigationScreenProp } from 'react-navigation';

interface State {
  values: Record<string, unknown>;
  errors: { [key: string]: string } | Record<string, unknown>;
  isSubmitting: boolean;
  loading: boolean;
}


interface Props {
  updateBookMutation: (variables: any) => Promise<any | null>;
  navigation: NavigationScreenProp<any, any> | any;
  route: any;
  getAuthorsQuery: any;
  getCategoriesQuery: any;
  getLanguagesQuery: any;
}

class EditBook extends React.PureComponent<Props, State> {
  state = {
    values: {
      id: this.props.route.params.book.id,
      title: '',
      authorId: null,
      publishedDate: '',
      type: '',
      status: '',
      condition: '',
      isbn: '',
      categoryId: null,
      languageId: null,
      price: '',
      description: '',
      coverFile: { uri: '', type: '' }
    },
    errors: {
      updateBook: '',
      title: '',
      authorId: null,
      publishedDate: '',
      categoryId: null,
      isbn: null,
      languageId: null,
      price: '',
      coverFile: null
    },
    isSubmitting: false,
    loading: false
  }

  submit = async () => {
    if (this.state.isSubmitting) {
      return
    }

    // Validation
    try {
      await updateBookSchema.validate(this.state.values, { abortEarly: false })
    } catch (err) {
      this.setState({ errors: formatYupErrors(err) })
    }

    const { values: { id, title, authorId, publishedDate, type, status, condition, isbn, categoryId, languageId, price, description, coverFile }, errors } = this.state

    let coverFileWraped
    if (coverFile) {
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

      this.props.updateBookMutation({
        variables: {
          bookId: id, title, authorId, publishedDate, type, status, condition, isbn: parseInt(isbn), categoryId, languageId, price: parseFloat(price),
          description, coverFile: coverFileWraped
        }, update: (store, { data: { updateBook } }) => {
          const { book, errors } = updateBook;

          if (errors) {
            return;
          }

          // Read the data from cache for this query.
          const data = store.readQuery({ query: GET_AVAILABLE_BOOKS });

          // Clone getAbailableBooks.
          const getAvailableBooksCloned = Object.assign(data.getAvailableBooks);
          // Update book from the mutation at same index.
          const getAvailableBooksUpdated = getAvailableBooksCloned.map(item => {
            if (item.id === book.id) {
              return book;
            }
          });

          // Write data back to the cache.
          store.writeQuery({ query: GET_AVAILABLE_BOOKS, data: { getAbailableBooks: getAvailableBooksUpdated } });
        }
      }).then(res => {
        const { book, errors } = res.data.updateBook;

        console.log("Resp data: ", book, errors)
        if (errors) {
          this.setState({ errors: formatServerErrors(errors) })
        } else {
          this.props.navigation.push('ViewBook', { name: 'View book', id: book.id })
        }
      }).catch(err => this.setState({ errors: err, isSubmitting: false }));
    }
  }

  onChangeText = (key, value) => {
    // Clone errors form state to local variable
    const errors = Object.assign({}, this.state.errors);
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
    const result = await launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3] });

    if (!result.cancelled) {
      // Clone errors form state to local variable
      const errors = Object.assign({}, this.state.errors);
      delete errors.coverFile;

      this.setState({ values: { ...this.state.values, coverFile: result }, errors })
    }
  }

  render() {
    const { values: { title, authorId, publishedDate, type, status, condition, isbn, categoryId, languageId, price, description, coverFile }, loading, isSubmitting, errors } = this.state
    const { book } = this.props.route.params
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
          {errors.updateBook && <View style={{ backgroundColor: colors.error }}><Text style={{ color: "white" }}>{errors.updateBook}</Text></View>}

          <Input value={title || book.title} onChangeText={text => this.onChangeText('title', text)} placeholder="Title" errorStyle={{ color: colors.error }}
            errorMessage={errors.title} />
          <View style={styles.authorContainer}>
            <Text style={styles.authorTitle}>Select author or add a new one</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={authorId || book.authors.id}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, authorId: itemValue } })
              }>
              {getAuthors && getAuthors.map(author =>
                <Picker.Item key={author.id} label={this.capitalizeFirstLetter(author.name)} value={author.id} />)}
            </Picker>
            {errors.authorId && <Text style={styles.cutomeTextError}>{errors.authorId}</Text>}
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
              onPress={() => { this.props.navigation.push('AddAuthor', { name: 'Add author', referrer: 'EditBook' }) }}
            />
          </View>
          <View>
            <Text style={styles.pickerTitle}>Type (Is is to for Sell or Rent)</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={type || book.type}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, type: itemValue } })
              }>
              <Picker.Item label="Rent" value="rent" />
              <Picker.Item label="Sell" value="sell" />
            </Picker>
          </View>
          <View>
            <Text style={styles.pickerTitle}>Status</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={status || book.status}
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
              selectedValue={condition || book.condition}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, condition: itemValue } })
              }>
              <Picker.Item label="New" value="new" />
              <Picker.Item label="Used" value="used" />
              <Picker.Item label="Old" value="old" />
            </Picker>
          </View>
          <Input value={publishedDate || book.published_date} onChangeText={text => this.onChangeText('publishedDate', text)} placeholder="Published date ( Optional )" errorStyle={{ color: colors.error }}
            errorMessage={errors.publishedDate} />
          <Input value={isbn.toString() || book.isbn.toString()} onChangeText={text => this.onChangeText('isbn', text)} placeholder="ISBN" errorStyle={{ color: colors.error }}
            errorMessage={errors.isbn} />
          <View>
            <Text style={styles.pickerTitle}>Category</Text>
            <Picker
              itemStyle={styles.picker}
              selectedValue={categoryId || book.categories.id}
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
              selectedValue={languageId || book.languages.id}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ values: { ...this.state.values, languageId: itemValue } })
              }>
              {getLanguages && getLanguages.map(language =>
                <Picker.Item key={language.id} label={this.capitalizeFirstLetter(language.name)} value={language.id} />)}
            </Picker>
            {errors.languageId && <Text style={styles.cutomeTextError}>{errors.languageId}</Text>}
          </View>
          <Input value={price.toString() || book.price.toString()} onChangeText={text => this.onChangeText('price', text)} placeholder="price" errorStyle={{ color: colors.error }}
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
              title="Choose another image"
              style={{ alignSelf: 'center', marginBottom: 10 }}
            />
            {errors.coverFile && <Text style={styles.cutomeTextError}>{errors.coverFile}</Text>}
            {<Image source={{ uri: coverFile ? coverFile.uri : book.cover_url }} style={styles.image} PlaceholderContent={<ActivityIndicator />} accessibilityIgnoresInvertColors />}
          </View>
          <TextInput
            style={styles.description}
            value={description || book.description}
            multiline={true}
            numberOfLines={4}
            onChangeText={text => this.onChangeText('description', text)} placeholder="Description" />

          <Divider style={{ marginTop: 20, marginBottom: 20 }} />

          <Button
            title="Edit"
            icon={
              <Icon
                name="pencil-square-o"
                size={20}
                style={{ marginRight: 10 }}
                color='white'
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
    backgroundColor: 'white',
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
  cutomeTextError: {
    color: colors.error,
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: -5
  }
});

const MutationQueries = compose(
  graphql(UPDATE_BOOK_MUTATION, {
    name: "updateBookMutation"
  }),
  graphql(GET_CATEGORIES_QUERY, {
    name: "getCategoriesQuery"
  }),
  graphql(GET_LANGUAGES_QUERY, {
    name: "getLanguagesQuery"
  }),
  graphql(GET_AUTHORS_QUERY, {
    name: "getAuthorsQuery"
  })
)(EditBook);

export default MutationQueries;
