import React from "react";
import { NativeRouter, Route, Switch } from "react-router-native";

import Signup from "../signup";
import Login from "../login";
import Books from "../books";
import Book from "../book";

export default () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/books" component={Books} />
      <Route exact path="/book" component={Book} />
    </Switch>
  </NativeRouter>
)