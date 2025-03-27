import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const addJob = createAsyncThunk(
    'jobs/addJob',
    async (data, {rejectWithValue}) => {
        return await CRUDMethods.create(data,'/jobs/create',{rejectWithValue})
    }
)

export const removeJob = createAsyncThunk(
    'jobs/removeJob',
    async (id, {rejectWithValue}) => {
        return await CRUDMethods.remove(`/jobs/remove/${id}`,{rejectWithValue})
    }
)

const jobsSlice = createSlice({
    name: "jobs",
    initialState: initialState.jobs,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.job=null;
            })
            .addCase(addJob.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.job=null;
            })
            .addCase(addJob.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.job=action.payload;
            })
            .addCase(removeJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.job=null;
            })
            .addCase(removeJob.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.job=null;
            })
            .addCase(removeJob.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.job=action.payload;
            })


    }
})

export default jobsSlice.reducer;