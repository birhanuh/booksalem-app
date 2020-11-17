import React from "react";
import { Text, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, gql } from '@apollo/client';

import { MeContext } from "../context";

import { reactNavigationTheme } from '../theme';

import CreateAccount from "../createAccount";
import SignIn from "../signIn";
import Books from "../book/books";
import AddBook from "../book/addBook";
import ViewBook from "../book/viewBook";
import User from "../user";
import Orders from "../orders";
import ViewOrder from "../orders/viewOrder";
import Checkouts from "../checkout/chekcouts";
import ViewCheckout from "../checkout/viewCheckout";
import Settings from "../settings";
import { colors } from "react-native-elements";

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode='none'>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);

const BookStack = createStackNavigator();
const BookStackScreen = () => (
  <BookStack.Navigator>
    <BookStack.Screen name='Books' component={Books} />
    <BookStack.Screen name='AddBook' component={AddBook} />
    <BookStack.Screen name='ViewBook' component={ViewBook} options={({ route }) => ({
      title: route.params.name
    })} />
  </BookStack.Navigator>
)

const OrderStack = createStackNavigator();
const OrderStackScreen = () => (
  <OrderStack.Navigator>
    <OrderStack.Screen name='Orders' component={Orders} />
    <OrderStack.Screen name='ViewOrder' component={ViewOrder} />
  </OrderStack.Navigator>
)

const CheckoutStack = createStackNavigator();
const CheckoutStackScreen = () => (
  <CheckoutStack.Navigator>
    <CheckoutStack.Screen name='Checkouts' component={Checkouts} />
    <CheckoutStack.Screen name='ViewCheckout' component={ViewCheckout} />
  </CheckoutStack.Navigator>
)

const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name='Settings' component={Settings} />
    <SettingsStack.Screen name='User' component={User} />
  </SettingsStack.Navigator>
)

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  const me = React.useContext(MeContext);

  const nameThirdTab = me ? (me.is_admin ? 'Checkouts' : 'Settings') : 'CreateAccount'
  const componentThirdTab = me ? (me.is_admin ? CheckoutStackScreen : SettingsStackScreen) : AuthStackScreen

  return (<Tabs.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      let iconColor;

      if (route.name === 'Books') {
        iconName = 'book';
        iconColor = focused
          ? colors.primary
          : colors.grey3;
      } else if (route.name === 'Orders') {
        iconName = 'shopping-bag';
        iconColor = focused
          ? colors.primary
          : colors.grey3;
      } else if (route.name === 'Settings') {
        iconName = 'cog';
        iconColor = focused
          ? colors.primary
          : colors.grey3;
      } else if (route.name === 'Checkouts') {
        iconName = 'credit-card-alt';
        iconColor = focused
          ? colors.primary
          : colors.grey3;
      }

      // You can return any component that you like here!
      return <Icon name={iconName} size={size} color={iconColor} />;
    },
  })}
    tabBarOptions={{
      activeTintColor: colors.primary,
      inactiveTintColor: colors.grey3,
    }}>
    <Tabs.Screen name="Books" component={BookStackScreen} />
    <Tabs.Screen name="Orders" component={me ? OrderStackScreen : AuthStackScreen} />
    <Tabs.Screen name={nameThirdTab} component={componentThirdTab} />
  </Tabs.Navigator>
  );
}

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Books">
    <Drawer.Screen name="Books" component={TabsScreen} />
    <Drawer.Screen name='AddBook' component={AddBook} options={{ title: "Add book" }} />
    <Drawer.Screen name="Settings" component={SettingsStackScreen} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="Kemetsehaft alem"
      component={DrawerScreen}
      options={{
        animationEnabled: false
      }}
    />
    {/* <RootStack.Screen
      name="Auth"
      component={AuthStackScreen}
      options={{
        animationEnabled: false
      }}
    /> */}
  </RootStack.Navigator>
);

const GET_ME_QUERY = gql`
  query {
    me {
      id
      name
      email
      phone
      is_admin
    }
  }
`

export default () => {
  const { loading, error, data } = useQuery(GET_ME_QUERY);

  if (error) {
    return (<SafeAreaView style={styles.loadingContainer}><Text style={styles.error}>{error.message}</Text></SafeAreaView>);
  }

  if (loading) {
    return (<SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator />
    </SafeAreaView>);
  }

  const { me } = data;

  return (
    <MeContext.Provider value={me}>
      <NavigationContainer theme={reactNavigationTheme}>
        <RootStackScreen />
      </NavigationContainer>
    </MeContext.Provider >
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    fontSize: 18,
    paddingHorizontal: 20
  }
});

