import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import chatReducer from "./chat/chatSlice";
import uploadReducer from "./upload/uploadSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
