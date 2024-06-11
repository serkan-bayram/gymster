import { AddingWorkout } from "@/utils/types/workout";
import { createSlice } from "@reduxjs/toolkit";

interface WorkoutState {
  addingWorkout: AddingWorkout;
}

const initialAddingWorkout = {
  exercise: null,
  weight: null,
  repeat: null,
};

const initialState: WorkoutState = {
  // We update this object when user is currently adding a workout
  addingWorkout: { ...initialAddingWorkout },
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setExercise: (state, action) => {
      state.addingWorkout.exercise = action.payload;
    },
    setWeight: (state, action) => {
      state.addingWorkout.weight = action.payload;
    },
    setRepeat: (state, action) => {
      state.addingWorkout.repeat = action.payload;
    },
    saveWorkout: (state) => {
      console.log(state.addingWorkout);
    },
    resetAddingWorkout: (state) => {
      return { ...state, addingWorkout: initialAddingWorkout };
    },
  },
});

export const {
  setExercise,
  setWeight,
  setRepeat,
  saveWorkout,
  resetAddingWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;
