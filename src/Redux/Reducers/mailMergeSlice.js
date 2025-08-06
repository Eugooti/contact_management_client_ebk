import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const readMailMergeList = createAsyncThunk(
    "mailMerge/read",
    async (_,{rejectWithValue}) => {
        return await CRUDMethods.read('/mailMerge/list',{rejectWithValue})
    }
)

const MailMergeSlice = createSlice({
    name: "mailMerge",
    initialState:initialState.mailMerge,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(readMailMergeList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.mailMergeList = null;
            })
            .addCase(readMailMergeList.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.mailMergeList = null;
            })
            .addCase(readMailMergeList.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.mailMergeList = action.payload;
            })
    }
})

export default MailMergeSlice.reducer;