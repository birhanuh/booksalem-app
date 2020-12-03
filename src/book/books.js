import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Divider, colors, Button, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery } from '@apollo/client';
import GET_AVAILABLE_BOOKS from './availableBooks.graphql';

const Books = ({ route, navigation }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { loading, error, data } = useQuery(GET_AVAILABLE_BOOKS);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  const handleLoadMore = async () => {
    if (data.getAvailableBooks && data.getAvailableBooks.hasMore) {
      setIsLoadingMore(true);

      await fetchMore({
        variables: {
          after: data.getAvailableBooks.cursor,
        },
      });

      setIsLoadingMore(false);
    }
  }

  const renderHeader = () => (
    <SearchBar placeholder='Search...' lightTheme round />
  )

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
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshing={isLoadingMore}
        onRefresh={handleLoadMore}
        renderItem={({ item }) => (
          // implemented with Text and Button as children
          <Card style={styles.card}>
            <Card.Title>{item.title}</Card.Title>
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
                  <Text style={styles.label}>Status: </Text>{item.status}
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
        )}
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