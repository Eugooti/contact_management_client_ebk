import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const createUser = createAsyncThunk(
    'users/createUser',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/users/create',{rejectWithValue})
    }
)

const userSlice = createSlice({
    name: 'users',
    initialState: initialState.Users,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true
                state.error = null
                state.user = null
            })
            .addCase(createUser.rejected, (state,action) => {
                state.loading = false
                state.error = action.payload
                state.user = null
            })
            .addCase(createUser.fulfilled, (state,action) => {
                state.loading = false
                state.error = null
                state.user = action.payload
            })

    }
})

export default userSlice.reducer