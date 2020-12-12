import React, { useState } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, Badge, Card, Divider, colors, Button, ButtonGroup, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import GET_AVAILABLE_BOOKS from './availableBooks.graphql';

const Books = ({ route, navigation }) => {
  const [searchString, setSearchString] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { loading, data, error, fetchMore, variables } = useQuery(GET_AVAILABLE_BOOKS, {
    variables: {
      searchString,
      typeCode: selectedIndex,
    }
  });

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  const handleLoadMore = async () => {
    fetchMore({
      variables: {
        ...variables,
        offset: data.getAvailableBooks.length,
        limit: 2
      },
      // updateQuery: (prev, { fetchMoreResult }) => {
      //   if (!fetchMoreResult) {
      //     return prev;
      //   }

      //   return {
      //     getAvailableBooks: [
      //       ...prev.getAvailableBooks,
      //       ...fetchMoreResult.getAvailableBooks
      //     ]
      //   };
      // },
    });
  }

  const updateSearch = (search) => {
    setSearchString(search);
  };

  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex)
  }

  const renderFooter = () => {
    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </SafeAreaView>
      );
    } else {
      return null
    }
  }


  const { getAvailableBooks } = !!data && data

  return (
    <View style={styles.container}>
      <FlatList
        data={getAvailableBooks}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<>
          <SearchBar placeholder='Search...' lightTheme round containerStyle={{ position: 'fixed' }} onChangeText={updateSearch} value={searchString} />

          <ButtonGroup
            onPress={updateIndex}
            selectedIndex={selectedIndex}
            buttons={['Rent', 'Sell']}
            containerStyle={{ textTransform: 'uppercase' }}
          />
        </>}
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0}
        renderItem={({ item }) => {
          let bookBadgeStatus
          switch (item.status) {
            case 'available':
              bookBadgeStatus = 'success'
              break;
            case 'ordered':
              bookBadgeStatus = 'primary'
              break;
            case 'rented':
              bookBadgeStatus = 'warning'
              break;
            case 'sold':
              bookBadgeStatus = 'error'
              break;
            default:
              break;
          }
          return (
            // implemented with Text and Button as children
            <Card style={styles.card}>
              <Card.Title>{item.title}</Card.Title>
              <Text style={styles.type}>{item.type}</Text>
              <Card.Divider />
              <Card.Image source={{ uri: item.cover_url }} />
              <View style={styles.bookInfoPriceContainer}>
                <View>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Author: </Text>{item.authors.name}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Language: </Text>{item.languages.name}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Category: </Text>{item.categories.name}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={styles.label}>Status: </Text><Badge
                      status={bookBadgeStatus}
                      value={item.status}
                      containerStyle={{ marginTop: -4 }}
                    />
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {item.price}
                  </Text>
                  <Text style={styles.currency}>ETB</Text>
                </View>
              </View>
              <Text style={styles.text}>
                {item.description}
              </Text>

              <Divider style={styles.divider} />
              <Text style={styles.rating}>
                {item.rating}
                <Icon id='1' name='star' style={styles.star} />
                <Icon id='2' name='star' style={styles.star} />
                <Icon id='3' name='star' style={styles.star} />
                <Icon id='4' name='star' style={styles.star} />
                <Icon id='5' name='star' style={styles.star} />
              </Text>

              <Divider style={styles.divider} />

              <Button
                title="View"
                icon={
                  <Icon
                    name="plus-circle"
                    size={20}
                    style={{ marginRight: 10 }}
                    color={colors.white}
                  />
                }
                onPress={() => { navigation.push('ViewBook', { name: 'View book', id: item.id }) }}
              />
            </Card>
          )
        }}
      />
    </View>)
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  bookInfoPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  card: {
    shadowColor: colors.divider,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  type: {
    textTransform: 'uppercase',
    position: 'absolute',
    right: 0,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.greyOutline,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#49BD78',
  },
  text: {
    marginTop: 10,
    textTransform: 'capitalize'
  },
  currency: {
    marginTop: 10,
    textTransform: 'uppercase'
  },
  rating: {
    flex: 1,
    textAlign: 'right'
  },
  star: {
    fontSize: 24,
    color: colors.disabled
  },
  divider: {
    marginTop: 6,
    marginBottom: 6
  },
  label: {
    fontWeight: '600',
  }
});

export default Books