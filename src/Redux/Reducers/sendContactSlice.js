import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const sendContact = createAsyncThunk(
    'contact/send',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/contact/send',{rejectWithValue});
    }
)

const sendContactSlice = createSlice({
    name: "sendContact",
    initialState: initialState.send,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(sendContact.pending, (state) => {
                state.loading = true;
                state.error=null;
                state.send = null
            })
            .addCase(sendContact.rejected, (state, action) => {
                state.loading = false;
                state.error=action.payload;
                state.send = null
            })
            .addCase(sendContact.fulfilled, (state, action) => {
                state.loading = false;
                state.error=null;
                state.send = action.payload;
            })

    }
})

export default sendContactSlice.reducer;