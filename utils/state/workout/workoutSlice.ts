import {
  AddingWorkout,
  AllWorkouts,
  DefaultExercises,
  ExtraWorkout,
  TodaysWorkoutsDB,
} from "@/utils/types/workout";
import { createSlice } from "@reduxjs/toolkit";

interface WorkoutState {
  addingWorkout: AddingWorkout;
  todaysWorkouts: TodaysWorkoutsDB | null;
  defaultExercises: DefaultExercises | null;
  allWorkouts: AllWorkouts[] | null;
  extraWorkouts: ExtraWorkout[] | null;
}

const initialAddingWorkout = {
  exerciseId: null,
  exercise: null,
  weight: null,
  repeat: null,
  comment: null,
};

const initialState: WorkoutState = {
  // We update this object when user is currently adding a workout
  addingWorkout: { ...initialAddingWorkout },
  // We fetch todaysWorkouts from DB
  todaysWorkouts: null,
  defaultExercises: null,
  allWorkouts: null,
  extraWorkouts: null,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    // We use this dispatch when user is adding a workout
    setAddingWorkout: (state, action) => {
      switch (action.payload.type) {
        case "comment":
          state.addingWorkout.comment = action.payload.comment;
          break;
        case "exercise":
          state.addingWorkout.exerciseId = action.payload.exerciseId;
          state.addingWorkout.exercise = action.payload.exercise;
          break;
        case "weight":
          state.addingWorkout.weight = action.payload.weight;
          break;
        case "repeat":
          state.addingWorkout.repeat = action.payload.repeat;
          break;
        default:
          console.log("Error on setAddingWorkout Slice: ", action.payload);
          break;
      }
    },
    // We set todays workouts when we fetch it from DB
    setTodaysWorkouts: (state, action) => {
      state.todaysWorkouts = action.payload;
    },
    setDefaultExercises: (state, action) => {
      state.defaultExercises = action.payload;
    },
    setAllWorkouts: (state, action) => {
      state.allWorkouts = action.payload;
    },
    setExtraWorkouts: (state, action) => {
      state.extraWorkouts = action.payload;
    },
    resetAddingWorkout: (state) => {
      return { ...state, addingWorkout: initialAddingWorkout };
    },
  },
});

export const {
  setTodaysWorkouts,
  resetAddingWorkout,
  setAddingWorkout,
  setDefaultExercises,
  setAllWorkouts,
  setExtraWorkouts,
} = workoutSlice.actions;

export default workoutSlice.reducer;
