import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  renderConfetti: false,
};

const confettiSlice = createSlice({
  name: "confetti",
  initialState,
  reducers: {
    setRenderConfetti: (state, action) => {
      state.renderConfetti = action.payload;
    },
  },
});

export const { setRenderConfetti } = confettiSlice.actions;

export default confettiSlice.reducer;
