import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";
import {CRUDMethods} from "../CRUD/Index.js";

export const readContacts = createAsyncThunk(
    'contacts/readContacts',
    async (_,{rejectWithValue}) => {
        return await CRUDMethods.read('/contacts/read',{rejectWithValue});
    }
)

export const createMinistry = createAsyncThunk(
    'contacts/createMinistry',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/create/ministry',{rejectWithValue})
    }
)

export const createParasatal = createAsyncThunk(
    'contacts/createParasaltal',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/create/parastatal',{rejectWithValue})
    }
)

export const createPrivate = createAsyncThunk(
    'contacts/createPrivate',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/create/private',{rejectWithValue})
    }
)

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (id,{rejectWithValue}) => {
        return await CRUDMethods.remove(`/contact/delete/${id}`,{rejectWithValue})
    }
)

export const createOrganization = createAsyncThunk(
    "contacts/createOrganization",
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/create',{rejectWithValue})
    }
)

const contactsSlice = createSlice({
    name: "contacts",
    initialState: initialState.contacts,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(readContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contacts = [];
            })
            .addCase(readContacts.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contacts = [];
            })
            .addCase(readContacts.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contacts = action.payload;
            })

            .addCase(createMinistry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contact = null;
            })
            .addCase(createMinistry.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact = null;
            })
            .addCase(createMinistry.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contact = action.payload;
            })

            .addCase(createOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contact = null;
            })
            .addCase(createOrganization.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact = null;
            })
            .addCase(createOrganization.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contact = action.payload;
            })

            .addCase(createParasatal.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contact = null;
            })
            .addCase(createParasatal.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact = null;
            })
            .addCase(createParasatal.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contact = action.payload;
            })
            .addCase(createPrivate.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contact = null;
            })
            .addCase(createPrivate.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact = null;
            })
            .addCase(createPrivate.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contact = action.payload;
            })
            .addCase(deleteContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contact = null;
            })
            .addCase(deleteContact.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.contact = null;
            })
            .addCase(deleteContact.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.contact = action.payload;
            })
    }
})

export default contactsSlice.reducer;