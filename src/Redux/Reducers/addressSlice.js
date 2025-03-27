import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CRUDMethods} from "../CRUD/Index.js";
import {initialState} from "../states.js";

export const createAddress = createAsyncThunk(
    'address/create',
    async (data,{rejectWithValue}) => {
        return await CRUDMethods.create(data,'/address/create',{rejectWithValue})
    }
)

export const updateAddress = createAsyncThunk(
    'address/update',
    async ({data,id},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/address/update/${id}`,{rejectWithValue})
    }
)

export const deleteAddress = createAsyncThunk(
    'address/delete',
    async (id,{rejectWithValue}) => {
        return await CRUDMethods.remove(`/address/delete/${id}`,{rejectWithValue})
    }
)

const AddressSlice = createSlice({
    name: "address",
    initialState:initialState.address,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAddress.pending,state => {
                state.loading = true;
                state.error = null;
                state.address=null;
            })
            .addCase(createAddress.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.address=null;
            })
            .addCase(createAddress.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.address=action.payload;
            })
            .addCase(updateAddress.pending,state => {
                state.loading = true;
                state.error = null;
                state.address=null;
            })
            .addCase(updateAddress.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.address=null;
            })
            .addCase(updateAddress.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.address=action.payload;
            })
            .addCase(deleteAddress.pending,state => {
                state.loading = true;
                state.error = null;
                state.address=null;
            })
            .addCase(deleteAddress.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.address=null;
            })
            .addCase(deleteAddress.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.address=action.payload;
            })



    }
})

export default AddressSlice.reducer;