import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IMessage, ISendMessage } from "../../config/types";
import { fetchMessages, sendMessage } from "../../utils/apiCalls";

export interface IMessageState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  chats: IMessage[];
}

const initialState: IMessageState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  chats: [],
};

export const fetchAllMessage = createAsyncThunk(
  "chat/fetchAllMessage",
  async (_, thunkAPI) => {
    try {
      const res: IMessage[] = await fetchMessages();
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

export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async (data: ISendMessage, thunkAPI) => {
    try {
      const res: IMessage = await sendMessage(data);
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

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chatReset: (state: IMessageState) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.chats = [];
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IMessageState>) => {
    builder
      .addCase(fetchAllMessage.pending, (state: IMessageState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        fetchAllMessage.fulfilled,
        (state: IMessageState, action: PayloadAction<IMessage[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.chats = action.payload;
          state.message = "";
        }
      )
      .addCase(
        fetchAllMessage.rejected,
        (state: IMessageState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      )
      .addCase(sendChatMessage.pending, (state: IMessageState) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        sendChatMessage.fulfilled,
        (state: IMessageState, action: PayloadAction<IMessage>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.chats.push(action.payload);
          state.message = "";
        }
      )
      .addCase(
        sendChatMessage.rejected,
        (state: IMessageState, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.payload;
        }
      );
  },
});

export const { chatReset } = chatSlice.actions;
export default chatSlice.reducer;
