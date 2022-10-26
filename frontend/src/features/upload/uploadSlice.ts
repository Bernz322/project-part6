import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  IOneUpload,
  ISharedUploads,
  IUploads,
  IUserUploads,
} from "../../config/types";
import {
  addUpload,
  deleteUploadById,
  editUploadById,
  fetchSharedUploads,
  fetchUploads,
  fetchUserUploads,
} from "../../utils/apiCalls";

export interface IUploadState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  uploads: IUploads[];
  userUploads: IUserUploads[];
  sharedToUserUploads: ISharedUploads[];
  selectedUpload: IOneUpload;
}

const initialState: IUploadState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  uploads: [],
  userUploads: [],
  sharedToUserUploads: [],
  selectedUpload: {} as IOneUpload,
};

export const fetchAllUploads = createAsyncThunk(
  "upload/fetchAllUploads",
  async (_, thunkAPI) => {
    try {
      const res: IUploads[] = await fetchUploads();
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

export const fetchCurrentUserUploads = createAsyncThunk(
  "upload/fetchCurrentUserUploads",
  async (_, thunkAPI) => {
    try {
      const res: IUserUploads[] = await fetchUserUploads();
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

export const fetchSharedToUserUploads = createAsyncThunk(
  "upload/fetchSharedToUserUploads",
  async (_, thunkAPI) => {
    try {
      const res: ISharedUploads[] = await fetchSharedUploads();
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

export const createUpload = createAsyncThunk(
  "upload/createUpload",
  async (form: FormData, thunkAPI) => {
    try {
      const res: IOneUpload = await addUpload(form);
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

export const editUpload = createAsyncThunk(
  "upload/editUpload",
  async (data: { id: string; label: string }, thunkAPI) => {
    try {
      const res: { id: string; label: string } = await editUploadById(
        data.id,
        data.label
      );
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

export const deleteUpload = createAsyncThunk(
  "upload/deleteUpload",
  async (id: string, thunkAPI) => {
    try {
      await deleteUploadById(id);
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

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    uploadReset: (state: IUploadState) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.uploads = [];
      state.userUploads = [];
      state.sharedToUserUploads = [];
      state.selectedUpload = {} as IOneUpload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IUploadState>) => {
    builder
      .addCase(fetchAllUploads.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchAllUploads.fulfilled,
        (state: IUploadState, action: PayloadAction<IUploads[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.uploads = action.payload;
        }
      )
      .addCase(
        fetchAllUploads.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(fetchCurrentUserUploads.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchCurrentUserUploads.fulfilled,
        (state: IUploadState, action: PayloadAction<IUserUploads[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.userUploads = action.payload;
        }
      )
      .addCase(
        fetchCurrentUserUploads.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(fetchSharedToUserUploads.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchSharedToUserUploads.fulfilled,
        (state: IUploadState, action: PayloadAction<ISharedUploads[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.sharedToUserUploads = action.payload;
        }
      )
      .addCase(
        fetchSharedToUserUploads.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(createUpload.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        createUpload.fulfilled,
        (state: IUploadState, action: PayloadAction<IOneUpload>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.userUploads.push(action.payload);
        }
      )
      .addCase(
        createUpload.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(editUpload.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        editUpload.fulfilled,
        (
          state: IUploadState,
          action: PayloadAction<{ id: string; label: string }>
        ) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.userUploads = state.userUploads.map((upload) =>
            upload.id === action.payload.id
              ? { ...upload, label: action.payload.label }
              : upload
          );
        }
      )
      .addCase(
        editUpload.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(deleteUpload.pending, (state: IUploadState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        deleteUpload.fulfilled,
        (state: IUploadState, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.message = "";
          state.userUploads = state.userUploads.filter(
            (upload) => upload.id !== action.payload
          );
        }
      )
      .addCase(
        deleteUpload.rejected,
        (state: IUploadState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      );
  },
});

export const { uploadReset } = uploadSlice.actions;
export default uploadSlice.reducer;
