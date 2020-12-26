import React from "react";

interface Me {
  __typename: string;
  id: string;
  email: string;
  is_admin: boolean,
  name: string;
  phone: string;
}

export const MeContext = React.createContext({} as Me);
export const UserCheckoutNotificationContext = React.createContext(0);