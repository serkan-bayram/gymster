import { createSlice } from "@reduxjs/toolkit";
import * as Crypto from "expo-crypto";

interface NotificationState {
  show: string | true | false;
  text?: {
    heading: string;
    content: string;
  };
  type?: NotificationType;
}

type NotificationType = "success" | "error";

const initialState: NotificationState = {
  show: false,
  text: {
    heading: "",
    content: "",
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: { payload: NotificationState }) => {
      state.show = !action.payload.show ? false : Crypto.randomUUID();
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
