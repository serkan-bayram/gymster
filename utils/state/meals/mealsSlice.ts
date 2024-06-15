import { Meal } from "@/utils/types/meals";
import { createSlice } from "@reduxjs/toolkit";

interface MealsState {
  meals: Meal[];
}

const initialState: MealsState = {
  meals: [],
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setMeals: (state, action) => {
      state.meals = action.payload;
    },
  },
});

export const { setMeals } = mealsSlice.actions;

export default mealsSlice.reducer;
