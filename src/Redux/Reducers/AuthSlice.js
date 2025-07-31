import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const login =createAsyncThunk(
    'auth/login',
    async(data,{rejectWithValue})=>{
        return await CRUDMethods.create(data,'/auth/login',{rejectWithValue})
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async(_,{rejectWithValue})=>{
        return await CRUDMethods.read('/auth/logout',{rejectWithValue})
    }
)

export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async({data,id},{rejectWithValue})=>{
        return await CRUDMethods.update(data,`/auth/changePassword/${id}`,{rejectWithValue})
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState.auth,
    reducers:{},
    extraReducers:builder => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.user =null
            })
            .addCase(login.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.user =null
            })
            .addCase(login.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.user =action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.user =null
            })
            .addCase(logout.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.user =null
            })
            .addCase(logout.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.user =action.payload;
            })
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.user =null
            })
            .addCase(updatePassword.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.user =null
            })
            .addCase(updatePassword.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.user =action.payload;
            })
    }
})

export default authSlice.reducer;