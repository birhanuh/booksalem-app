import {
  SET_ME,
  REMOVE_ME
} from "./types";

// Action creators
export const setMe = (me) => {
  return {
    type: SET_ME,
    me
  };
}

export const removeMe = () => {
  return {
    type: REMOVE_ME
  };
}