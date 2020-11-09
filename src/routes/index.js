import React from "react";
import { NativeRouter, Route, Switch } from "react-router-native";
import { View, ScrollView } from 'react-native';

import Footer from "../layout/footer";
import Menu from "../layout/menu";

import Signup from "../signup";
import Login from "../login";
import Books from "../books/list";
import AddBook from "../books/addBook";
import ViewBook from "../books/viewBook";
import Book from "../book";
import User from "../user";
import Orders from "../orders";
import ViewOrder from "../orders/viewOrder";

export default () => (
  <NativeRouter>
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 2 }}>
        <Switch>
          <Route exact path="/" component={Books} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/book-view" component={Book} />
          <Route exact path="/book-view" component={ViewBook} />
          <Route exact path="/book-add" component={AddBook} />
          <Route exact path="/user" component={User} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/order-view" component={ViewOrder} />
          <Route exact path="/menu" component={Menu} />
        </Switch>
      </ScrollView>
      {/* Footer  */}
      <Footer />
    </View>
  </NativeRouter>
)

