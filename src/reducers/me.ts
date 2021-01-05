import { SET_ME, REMOVE_ME } from "../actions/types";

interface Action {
  id: string;
  type: string;
  me: Me
}

interface Me {
  __typename: string;
  id: string;
  email: string;
  is_admin: boolean,
  name: string;
  phone: string;
}

export default (state: {} = null, action: Action = { id: '', type: '', me: null }) => {
  switch (action.type) {
    case SET_ME:
      return action.me;

    case REMOVE_ME:
      let me = Object.assign({}, state);
      me = null;

      return me;

    default:
      return state;
  }
};
