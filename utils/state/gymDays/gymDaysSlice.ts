import { createSlice } from "@reduxjs/toolkit";

interface GYMDaysState {
  wentToGYM: boolean;
  wentToGYMDays: number[];
}

const initialState: GYMDaysState = {
  wentToGYM: false,
  wentToGYMDays: [],
};

const gymDaysSlice = createSlice({
  name: "gymDays",
  initialState,
  reducers: {
    setWentToGYM: (state, action) => {
      state.wentToGYM = action.payload;
    },
    // TODO: there is a problem, performance issue?
    // just print wentToGYMDays
    setWentToGYMDays: (state, action) => {
      if (state.wentToGYMDays.length === 0) {
        state.wentToGYMDays = action.payload;
      } else {
        // Optimistic updates
        // Add todays date if not already added
        const todaysDate: number = action.payload;

        if (state.wentToGYMDays.includes(todaysDate)) {
          const updatedDays = state.wentToGYMDays.filter(
            (days) => days !== todaysDate
          );

          state.wentToGYMDays = updatedDays;
        } else {
          const updatedDays = [...state.wentToGYMDays];
          updatedDays.push(todaysDate);

          state.wentToGYMDays = updatedDays;
        }
      }
    },
  },
});

export const { setWentToGYM, setWentToGYMDays } = gymDaysSlice.actions;

export default gymDaysSlice.reducer;
