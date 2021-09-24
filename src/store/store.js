import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import auth from "./auth/authReducer";

const combinedReducers = combineReducers({
  auth,
});

const store = configureStore({
  reducer: combinedReducers,
});
export default store;
