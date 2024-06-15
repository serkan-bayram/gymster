import { createSlice } from "@reduxjs/toolkit";

interface WaterState {
  updateValue: number;
  goalValue: number;
  progress: number;
}

const initialState: WaterState = {
  updateValue: 200,
  goalValue: 2000,
  progress: 0,
};

const waterSlice = createSlice({
  name: "water",
  initialState,
  reducers: {
    setUpdateValue: (state, action) => {
      state.updateValue = action.payload;
    },
    setGoalValue: (state, action) => {
      state.goalValue = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const { setUpdateValue, setGoalValue, setProgress } = waterSlice.actions;

export default waterSlice.reducer;
