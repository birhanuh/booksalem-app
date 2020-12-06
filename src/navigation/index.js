import React, { useContext } from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
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
import EditBook from "../book/editBook";
import User from "../user";
import UserOrders from "../orders/userOrders";
import AllOrdersAdmin from "../orders/admin/allOrders";
import ViewUserOrdersAdmin from "../orders/admin/viewUserOrders";
import UserCheckouts from "../checkout/userCheckouts";
import AllCheckoutsAdmin from "../checkout/admin/allChekcouts";
import FormCheckoutAdmin from "../checkout/admin/formCheckout";
import Settings from "../settings";
import Authors from "../author/authors";
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
    <BookStack.Screen name='EditBook' component={EditBook} options={({ route }) => ({
      title: route.params.name
    })} />
    <BookStack.Screen name='Authors' component={Authors} options={({ route }) => ({
      title: route.params.name
    })} />
  </BookStack.Navigator>
)

const OrderStack = createStackNavigator();
const OrderStackScreen = () => (
  <OrderStack.Navigator>
    <OrderStack.Screen name='UserOrders' component={UserOrders} options={{ title: "My orders" }} />
  </OrderStack.Navigator>
)

const OrderAdminStack = createStackNavigator();
const OrderAdminStackScreen = () => (
  <OrderAdminStack.Navigator>
    <OrderAdminStack.Screen name='AllOrdersAdmin' component={AllOrdersAdmin} options={{ title: "All orders (Admin view)" }} />
    <OrderAdminStack.Screen name='ViewUserOrdersAdmin' component={ViewUserOrdersAdmin} options={{ title: "User orders (Admin view)" }} />
  </OrderAdminStack.Navigator>
)

const CheckoutStack = createStackNavigator();
const CheckoutStackScreen = () => (
  <CheckoutStack.Navigator>
    <CheckoutStack.Screen name='UserCheckouts' component={UserCheckouts} options={{ title: "My checkouts" }} />
  </CheckoutStack.Navigator>
)

const CheckoutAdminStack = createStackNavigator();
const CheckoutAdminStackScreen = () => (
  <CheckoutAdminStack.Navigator>
    <CheckoutAdminStack.Screen name='AllCheckoutsAdmin' component={AllCheckoutsAdmin} options={{ title: "All Checkouts (Admin view)" }} />
    <CheckoutAdminStack.Screen name='FormCheckoutAdmin' component={FormCheckoutAdmin} options={{ title: "Checkout Form (Admin view)" }} />
  </CheckoutAdminStack.Navigator>
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
  const me = useContext(MeContext);
  console.log('Tabs: ', me)

  return (<Tabs.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      let iconColor;

      if (route.name === 'Books') {
        iconName = 'book';
        iconColor = focused
          ? color
          : colors.grey3;
      } else if (route.name === 'Orders') {
        iconName = 'shopping-bag';
        iconColor = focused
          ? color
          : colors.grey3;
      } else if (route.name === 'Settings') {
        iconName = 'cog';
        iconColor = focused
          ? color
          : colors.grey3;
      } else if (route.name === 'Checkouts') {
        iconName = 'credit-card-alt';
        iconColor = focused
          ? color
          : colors.grey3;
      }

      return <Icon name={iconName} size={size} color={iconColor} />;
    },
  })}
    tabBarOptions={{
      activeTintColor: '#4682B4',
      inactiveTintColor: colors.grey3,
    }}>
    <Tabs.Screen name="Books" component={BookStackScreen} />
    <Tabs.Screen name="Orders" component={me.is_admin ? OrderAdminStackScreen : OrderStackScreen} options={{ title: me.is_admin ? "Users orders" : "My orders" }} />
    <Tabs.Screen name="Checkouts" component={me.is_admin ? CheckoutAdminStackScreen : CheckoutStackScreen} options={{ title: me.is_admin ? "Users checkouts" : 'My checkouts' }} />
    <Tabs.Screen name={'Settings'} component={SettingsStackScreen} />
  </Tabs.Navigator>
  );
}

const UnAuthTabs = createBottomTabNavigator();
const UnAuthTabsScreen = () => (<UnAuthTabs.Navigator screenOptions={({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    let iconColor;

    if (route.name === 'Books') {
      iconName = 'book';
      iconColor = focused
        ? color
        : colors.grey3;
    } else if (route.name === 'Orders') {
      iconName = 'shopping-bag';
      iconColor = focused
        ? color
        : colors.grey3;
    } else if (route.name === 'Checkouts') {
      iconName = 'credit-card-alt';
      iconColor = focused
        ? color
        : colors.grey3;
    } else if (route.name === 'CreateAccount') {
      iconName = 'user-plus';
      iconColor = focused
        ? color
        : colors.grey3;
    }

    return <Icon name={iconName} size={size} color={iconColor} />;
  },
})}
  tabBarOptions={{
    activeTintColor: '#4682B4',
    inactiveTintColor: colors.grey3,
  }}>
  <UnAuthTabs.Screen name="Books" component={BookStackScreen} />
  <UnAuthTabs.Screen name="Orders" component={AuthStackScreen} />
  <UnAuthTabs.Screen name="Checkouts" component={AuthStackScreen} />
  <UnAuthTabs.Screen name="CreateAccount" component={AuthStackScreen} />
</UnAuthTabs.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Books">
    <Drawer.Screen name="Books" component={TabsScreen} />
    <Drawer.Screen name="Settings" component={SettingsStackScreen} />
  </Drawer.Navigator>);

const DrawerAdmin = createDrawerNavigator();
const DrawerAdminScreen = () => (
  <DrawerAdmin.Navigator initialRouteName="Books">
    <DrawerAdmin.Screen name="Books" component={TabsScreen} />
    <DrawerAdmin.Screen name='AddBook' component={AddBook} options={{ title: "Add book" }} />
    <DrawerAdmin.Screen name='Authors' component={Authors} options={{ title: "Add author" }} />
    <DrawerAdmin.Screen name="Settings" component={SettingsStackScreen} />
  </DrawerAdmin.Navigator>);

const RootStack = createStackNavigator();
const RootStackScreen = ({ me }) => (
  <RootStack.Navigator>
    {me ? (<RootStack.Screen
      name="Kemetsehaft alem"
      component={me.is_admin ? DrawerAdminScreen : DrawerScreen}
      options={({ navigation }) => ({
        animationEnabled: false,
        headerRight: () => {
          let name

          const tokens = me.name.split(' ');
          name = tokens[0].charAt(0);

          if (!!tokens[1]) {
            name += tokens[1].charAt(0).toUpperCase();
          }
          // Avatar with Title
          return (<Avatar containerStyle={{ marginRight: 12, backgroundColor: colors.grey4 }} rounded title={name} onPress={() => navigation.navigate('Settings')} />)
        }
      })}
    />) :
      (<RootStack.Screen
        name="Kemetsehaft alem"
        component={UnAuthTabsScreen}
        options={{
          animationEnabled: false
        }}
      />)}
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
  const { loading, data } = useQuery(GET_ME_QUERY);

  if (loading) {
    return (<SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size='large' />
    </SafeAreaView>);
  }

  let me
  if (data) {
    me = data.me;
  }

  return (
    <MeContext.Provider value={me}>
      <NavigationContainer theme={reactNavigationTheme}>
        <RootStackScreen me={me} />
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

