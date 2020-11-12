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
import User from "../user";
import Orders from "../orders";
import ViewOrder from "../orders/viewOrder";
import Checkouts from "../checkouts/list";
import ViewCheckout from "../checkouts/viewCheckout";

export default () => (
  <NativeRouter>
    <View style={{ flex: 1, backgroundColor: '#F0F7FE' }}>
      <ScrollView>
        {/* Switch  */}
        <Switch>
          <Route exact path="/" component={Books} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/book/view/:id" component={ViewBook} />
          <Route exact path="/book/add" component={AddBook} />
          <Route exact path="/user" component={User} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/order/view/:id" component={ViewOrder} />
          <Route exact path="/checkouts" component={Checkouts} />
          <Route exact path="/checkout/view/:id" component={ViewCheckout} />
          <Route exact path="/menu" component={Menu} />
        </Switch>
      </ScrollView>
      {/* Footer  */}
      <Footer />
    </View>
  </NativeRouter>
)

