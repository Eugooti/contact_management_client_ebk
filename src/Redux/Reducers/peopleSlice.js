import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";
import {CRUDMethods} from "../CRUD/Index.js";


export const readOrganizationStaff = createAsyncThunk(
    "staff/read",
    async (id,{rejectWithValue})=>{
        return await CRUDMethods.read(`/organization/staff/${id}`,{rejectWithValue});
    }
)

const PeopleSlice = createSlice({
    name: "People",
    initialState: initialState.people,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(readOrganizationStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.people = null;
            })
            .addCase(readOrganizationStaff.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload;
                state.people = null;
            })
            .addCase(readOrganizationStaff.fulfilled, (state, action) => {
                state.loading = true;
                state.error = null;
                state.people = action.payload;
            })

    }
})

export default PeopleSlice.reducer;