import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";
import {CRUDMethods} from "../CRUD/Index.js";

export const readMinistries = createAsyncThunk(
    "ministries/read",
    async (_,{rejectWithValue}) => {
        return await CRUDMethods.read('/ministry/read',{rejectWithValue})
    }
)

const ministrySlice = createSlice({
    name: "ministry",
    initialState: initialState.ministry,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(readMinistries.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.ministries=null
            })
            .addCase(readMinistries.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.ministries=null
            })
            .addCase(readMinistries.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.ministries=action.payload;
            })

    }
})

export default ministrySlice.reducer;