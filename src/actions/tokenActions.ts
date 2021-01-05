import {
  SET_TOKEN,
  REMOVE_TOKEN
} from "./types";

// Action creators
export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    token
  };
}

export const removeToken = (token) => {
  return {
    type: REMOVE_TOKEN,
    token
  };
}
