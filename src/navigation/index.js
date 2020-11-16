import React, { useState, useMemo, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from "../context";

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
const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen name="Books" component={BookStackScreen} />
    <Tabs.Screen name="Orders" component={OrderStackScreen} />
    <Tabs.Screen name="Checkouts" component={CheckoutStackScreen} />
  </Tabs.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Books">
    <Drawer.Screen name="Books" component={TabsScreen} />
    <Drawer.Screen name='AddBook' component={AddBook} options={{ title: "Add book" }} />
    <Drawer.Screen name="Settings" component={SettingsStackScreen} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
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

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(async () => {
    const TOKEN = await AsyncStorage.getItem('@kemetsehaftalem/token');

    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken(TOKEN);
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken(TOKEN);
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (<SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator />
    </SafeAreaView>);
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={reactNavigationTheme}>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider >
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

