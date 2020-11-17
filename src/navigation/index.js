import React from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
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

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
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
  </SettingsStack.Navigator>
)

const UserStack = createStackNavigator();
const UserStackScreen = () => (
  <UserStack.Navigator>
    <UserStack.Screen name='User' component={User} />
  </UserStack.Navigator>
)

const Tabs = createBottomTabNavigator();
const TabsScreen = () => {
  const me = React.useContext(MeContext);
  const isMeAdmin = me & me.is_admin

  return (<Tabs.Navigator>
    <Tabs.Screen name="Books" component={BookStackScreen} />
    <Tabs.Screen name="Orders" component={me ? OrderStackScreen : AuthStackScreen} />
    <Tabs.Screen name={isMeAdmin ? 'Checkouts' : 'Settings'} component={isMeAdmin ? CheckoutStackScreen : SettingsStackScreen} />
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

const GET_ME = gql`
    query {
      me {
      id
      name
      email
      is_admin
    }
  }
`

export default () => {
  const { loading, error, data } = useQuery(GET_ME);

  if (error) {
    return;
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
  }
});

