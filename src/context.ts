import React from "react";

interface Me {
  id: number;
  is_admin: boolean
}

export const MeContext = React.createContext({} as Me);
export const UserCheckoutNotificationContext = React.createContext(0);