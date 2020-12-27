import { combineReducers } from "redux";
import me from "./me";
import token from "./token";

// combineReducers combines all passed reducers in to one state object
export default combineReducers({
  me,
  token
});
