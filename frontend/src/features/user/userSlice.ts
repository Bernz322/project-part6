import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IUser } from "../../config/types";
import { fetchLoggedInUser } from "../../utils/apiCalls";

export interface IUserState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  users: IUser[];
  currentUser: IUser;
  selectedUser: IUser;
}

const initialState: IUserState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  users: [],
  currentUser: {} as IUser,
  selectedUser: {} as IUser,
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
      state.selectedUser = {} as IUser;
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
      );
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
