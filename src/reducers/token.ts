import { SET_TOKEN, REMOVE_TOKEN } from "../actions/types";

interface Action {
  id: string;
  type: string;
  token: string
}

export default (state = '', action: Action = { id: '', type: '', token: null }) => {
  switch (action.type) {
    case SET_TOKEN:
      return action.token;

    case REMOVE_TOKEN:
      return action.token

    default:
      return state;
  }
};
