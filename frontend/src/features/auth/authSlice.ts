import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login, register } from "../../utils/apiCalls";
import { deleteCookie } from "../../utils/helpers";

export interface IAuthState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: IAuthState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Login User
export const authLogin = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await login(data.email, data.password);
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

// Register User
export const authRegister = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await register(data.name, data.email, data.password);
      return res;
    } catch (error: any) {
      console.log(error);
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

// Logout User
export const authLogout = createAsyncThunk("auth/logout", async () => {
  deleteCookie({
    cookieName: "accessToken",
    path: "/",
    domain: "localhost",
  });
  localStorage.removeItem("loggedUser");
  // TODO: Reset all states here
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReset: (state: IAuthState) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IAuthState>) => {
    builder
      .addCase(authLogin.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(authLogin.fulfilled, (state: IAuthState) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(
        authLogin.rejected,
        (state: IAuthState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(authRegister.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(authRegister.fulfilled, (state: IAuthState) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(
        authRegister.rejected,
        (state: IAuthState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      );
  },
});

export const { authReset } = authSlice.actions;
export default authSlice.reducer;
