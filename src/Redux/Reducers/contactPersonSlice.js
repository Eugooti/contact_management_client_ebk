import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const createContactPerson = createAsyncThunk(
    'contactPerson/create',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contactPerson/create',{rejectWithValue})
    }
)

export const updateContactPerson =createAsyncThunk(
    'contactPerson/update',
    async ({data,id},{rejectWithValue}) => {
        await CRUDMethods.update(data,`/contactperson/update/${id}`,{rejectWithValue})
    }
)

export const addContactItem = createAsyncThunk(
    'contactPerson/add-item',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contactperson/add-item',{rejectWithValue})
    }
)

export const deleteContactItem = createAsyncThunk(
    'contactItem/delete',
    async (id,{rejectWithValue}) => {
        return await CRUDMethods.remove(`/contactPerson/delete/${id}`, {rejectWithValue})
    }
)

export const deleteContactPerson = createAsyncThunk(
    'contactPerson/delete',
    async (id,{rejectWithValue}) => {
        return await CRUDMethods.remove(`contactPerson/delete/${id}`,{rejectWithValue})
    }
)

export const addContacts = createAsyncThunk(
    "contacts/addContacts",
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contactItem/create',{rejectWithValue})
    }
)

export const deleteContact = createAsyncThunk(
    "contacts/deleteContact",
    async (id,{rejectWithValue}) => {
        return await CRUDMethods.remove(`/contactItem/delete/${id}`,{rejectWithValue})
    }
)

const contactPersonSlice = createSlice({
    name:"contactPerson",
    initialState:initialState.contactPerson,
    reducers:{},
    extraReducers: builder => {
        builder
            .addCase(createContactPerson.pending,state => {
                state.loading = true;
                state.error = null;
                state.person= null
            })
            .addCase(createContactPerson.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.person= null
            })
            .addCase(createContactPerson.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.person= action.payload;
            })
            .addCase(updateContactPerson.pending,state => {
                state.loading = true;
                state.error = null;
                state.person= null
            })
            .addCase(updateContactPerson.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.person= null
            })
            .addCase(updateContactPerson.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.person= action.payload;
            })
            .addCase(addContactItem.pending,state => {
                state.loading = true;
                state.error = null;
                state.person= null
            })
            .addCase(addContactItem.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.person= null
            })
            .addCase(addContactItem.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.person= action.payload;
            })
            .addCase(deleteContactItem.pending,state => {
                state.loading = true;
                state.error = null;
                state.person= null
            })
            .addCase(deleteContactItem.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.person= null
            })
            .addCase(deleteContactItem.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.person= action.payload;
            })
            .addCase(deleteContactPerson.pending,state => {
                state.loading = true;
                state.error = null;
                state.person= null
            })
            .addCase(deleteContactPerson.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.person= null
            })
            .addCase(deleteContactPerson.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.person= action.payload;
            })
            .addCase(addContacts.pending,state => {
                state.loading = true;
                state.error = null;
                state.contact= null
            })
            .addCase(addContacts.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact= null
            })
            .addCase(addContacts.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.contact= action.payload;
            })

    }
})

export  default contactPersonSlice.reducer;