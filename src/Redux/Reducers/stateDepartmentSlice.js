import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";
import {CRUDMethods} from "../CRUD/Index.js";

export const readStateDepartment = createAsyncThunk(
    "stateDepartments/read",
    async (_,{rejectWithValue}) => {
        return await CRUDMethods.read('/stateDepartment/read',{rejectWithValue})
    }
)

const readStateDepartmentSlice = createSlice({
    name: "stateDepartment",
    initialState: initialState.stateDepartment,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(readStateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.stateDepartments=null
            })
            .addCase(readStateDepartment.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.stateDepartments=null
            })
            .addCase(readStateDepartment.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.stateDepartments=action.payload;
            })

    }
})

export default readStateDepartmentSlice.reducer;