import {configureStore} from "@reduxjs/toolkit";
import {initialState} from "./states.js";
import rootReducer from "./Reducers.js";

const store = configureStore({
    reducer:rootReducer,
    preloadedState:initialState,
});

export default store;