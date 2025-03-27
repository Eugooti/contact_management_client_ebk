import {combineReducers} from 'redux'
import contactsSlice from "./Reducers/contactsSlice.js";
import {initialState} from "./states.js";
import jobsSlice from "./Reducers/JobsSlice.js";
import shareSlice from "./Reducers/shareSlice.js";
import contactPersonSlice from "./Reducers/contactPersonSlice.js";
import sendContactSlice from "./Reducers/sendContactSlice.js";
import addressSlice from "./Reducers/addressSlice.js";
import authSlice from "./Reducers/AuthSlice.js";
import ministrySlice from "./Reducers/ministrySlice.js";
import stateDepartmentSlice from "./Reducers/stateDepartmentSlice.js";
import organizationSlice from "./Reducers/organizationSlice.js";
import peopleSlice from "./Reducers/peopleSlice.js";

const rootReducer = combineReducers({
    contacts:contactsSlice,
    jobs:jobsSlice,
    share:shareSlice,
    contactPerson:contactPersonSlice,
    send:sendContactSlice,
    address:addressSlice,
    auth: authSlice,
    ministry:ministrySlice,
    stateDepartment:stateDepartmentSlice,
    organization:organizationSlice,
    people:peopleSlice,
})

export default(state = initialState, action) => rootReducer(state, action)