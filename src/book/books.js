import React from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Divider, colors, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query {
    getAvailableBooks {
      id
      title
      author
      price
      status
      language
      category
      cover_url
      description
      rating
    }
  }
`

const Books = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (error) { console.error('error', error) };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  };

  const { getAvailableBooks } = data && data

  return (
    <View style={styles.container}>
      <FlatList
        data={getAvailableBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // implemented with Text and Button as children
          <Card style={styles.card}>
            <Card.Title>{item.title}</Card.Title>
            <Card.Divider />
            <Card.Image source={{ uri: item.cover_url }} />
            <View style={styles.bookInfoPriceContainer}>
              <View style={styles.bookInfoContainer}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Author: </Text>{item.author}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Language: </Text>{item.language}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Category: </Text>{item.category}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Category: </Text>{item.status}
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
    justifyContent: 'center',
    alignItems: 'center',
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