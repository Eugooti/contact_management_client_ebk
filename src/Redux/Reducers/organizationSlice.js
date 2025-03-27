import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {initialState} from "../states.js";
import {CRUDMethods} from "../CRUD/Index.js";

export const updateBoard = createAsyncThunk(
    'boards/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updateCommission = createAsyncThunk(
    'commission/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/commission/update/${id}`,{rejectWithValue});
    }
)

export const updateParastatal = createAsyncThunk(
    'parastatal/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updateMinistry = createAsyncThunk(
    'ministry/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updateStateDepartment = createAsyncThunk(
    'stateDepartment/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updateLearningInstitution = createAsyncThunk(
    'leaningInstitution/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updateCounties = createAsyncThunk(
    'counties/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updatePresidency = createAsyncThunk(
    'presidency/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

export const updatePrivateOrganization = createAsyncThunk(
    'privateOrganizations/update',
    async ({id,data},{rejectWithValue}) => {
        return await CRUDMethods.update(data,`/boards/update/${id}`,{rejectWithValue});
    }
)

const organizationSlice = createSlice({
    name: "organization",
    initialState: initialState.organizations,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(updateBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateBoard.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateBoard.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateCommission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateCommission.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateCommission.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateParastatal.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateParastatal.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateParastatal.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateMinistry.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateMinistry.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateMinistry.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateStateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateStateDepartment.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateStateDepartment.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateLearningInstitution.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateLearningInstitution.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateLearningInstitution.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updateCounties.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updateCounties.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updateCounties.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updatePresidency.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updatePresidency.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updatePresidency.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })
            .addCase(updatePrivateOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.organization = null
            })
            .addCase(updatePrivateOrganization.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
                state.organization = null
            })
            .addCase(updatePrivateOrganization.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.organization = action.payload;
            })


    }
})

export default organizationSlice.reducer;