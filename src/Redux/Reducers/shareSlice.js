import {CRUDMethods} from "../CRUD/Index.js";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";

const shareContact = createAsyncThunk(
    'contacts/share',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/share', {rejectWithValue})
    }
)

const shareSlice = createSlice({
    name: 'share',
    initialState: initialState.send,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(shareContact.pending,state => {
                state.loading = true;
                state.error = null;
                state.sent = null;
            })
            .addCase(shareContact.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.sent = null;
            })
            .addCase(shareContact.fulfilled,(state, action) => {
                state.loading = false;
                state.error = null;
                state.sent = action.payload;
            })
    }
})

export default shareSlice.reducer;