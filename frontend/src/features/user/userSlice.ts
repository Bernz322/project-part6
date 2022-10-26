import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IUser } from "../../config/types";
import {
  deleteUserById,
  editUserById,
  fetchLoggedInUser,
  fetchUserById,
  fetchUsers,
} from "../../utils/apiCalls";

export interface IUserState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  users: IUser[];
  currentUser: IUser;
}

const initialState: IUserState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  users: [],
  currentUser: {} as IUser,
};

export const fetchCurrentLoggedUser = createAsyncThunk(
  "user/fetchCurrentLoggedUser",
  async (_, thunkAPI) => {
    try {
      const res: IUser = await fetchLoggedInUser();
      return res;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res: IUser[] = await fetchUsers();
      return res;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchOneUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id: string, thunkAPI) => {
    try {
      const res: IUser = await fetchUserById(id);
      return res;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editOneUserById = createAsyncThunk(
  "user/editUserById",
  async (data: IUser, thunkAPI) => {
    try {
      await editUserById(data);
      return data;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteOneUserById = createAsyncThunk(
  "user/deleteUserById",
  async (id: string, thunkAPI) => {
    try {
      await deleteUserById(id);
      return id;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userReset: (state: IUserState) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.users = [];
      state.currentUser = {} as IUser;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IUserState>) => {
    builder
      .addCase(fetchCurrentLoggedUser.pending, (state: IUserState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchCurrentLoggedUser.fulfilled,
        (state: IUserState, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.currentUser = action.payload;
          state.message = "";
        }
      )
      .addCase(
        fetchCurrentLoggedUser.rejected,
        (state: IUserState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(fetchAllUsers.pending, (state: IUserState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state: IUserState, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.users = action.payload;
          state.message = "";
        }
      )
      .addCase(
        fetchAllUsers.rejected,
        (state: IUserState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(fetchOneUserById.pending, (state: IUserState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchOneUserById.fulfilled, (state: IUserState) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(
        fetchOneUserById.rejected,
        (state: IUserState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(editOneUserById.pending, (state: IUserState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        editOneUserById.fulfilled,
        (state: IUserState, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.users = state.users.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
          state.message = "";
        }
      )
      .addCase(
        editOneUserById.rejected,
        (state: IUserState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(deleteOneUserById.pending, (state: IUserState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        deleteOneUserById.fulfilled,
        (state: IUserState, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.users = state.users.filter(
            (user) => user.id !== action.payload
          );
          state.message = "";
        }
      )
      .addCase(
        deleteOneUserById.rejected,
        (state: IUserState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      );
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
