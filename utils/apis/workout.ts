import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { Alert } from "react-native";
import {
  setDefaultExercises,
  setTodaysWorkouts,
} from "../state/workout/workoutSlice";
import {
  createWorkoutDocument,
  getDefaultExercises,
  getTodaysWorkouts,
  updateWorkouts,
} from "../db/workout";
import { Exercise, TodaysWorkoutsDB } from "../types/workout";

// Default exercises for user to pick
export function useGetDefaultExercises() {
  const dispatch = useDispatch<AppDispatch>();

  const queryFn = async () => {
    const defaultExercises = await getDefaultExercises();

    dispatch(setDefaultExercises(defaultExercises));

    return defaultExercises;
  };

  return useQuery({
    queryKey: ["getDefaultExercises"],
    queryFn: queryFn,
  });
}

// Gets the workouts that belongs to current user, for today
export function useGetTodaysWorkouts() {
  const user = useSelector((state: RootState) => state.session.user);

  const dispatch = useDispatch<AppDispatch>();

  const queryFn = async () => {
    if (!user) return null;

    const todaysWorkouts = await getTodaysWorkouts(user);

    dispatch(setTodaysWorkouts(todaysWorkouts));

    return todaysWorkouts;
  };

  return useQuery({
    queryKey: ["getTodaysWorkouts"],
    queryFn: queryFn,
  });
}

export function useSaveWorkout() {
  const queryClient = useQueryClient();

  const { todaysWorkouts, addingWorkout } = useSelector(
    (state: RootState) => state.workout
  );

  const user = useSelector((state: RootState) => state.session.user);

  const mutationFn = async () => {
    if (!user) return null;

    // Did user filled all the add workout inputs
    const isAnyNullExists = JSON.stringify(addingWorkout).includes("null");

    if (isAnyNullExists) {
      Alert.alert("Hata", "Lütfen bütün bilgileri doldurunuz.", [
        { text: "Tamam" },
      ]);

      return null;
    }

    // First, let's check is there any workout document created?
    if (!!todaysWorkouts === false) {
      // Create one with current data if not
      await createWorkoutDocument(user, addingWorkout);
      // And we should update todaysWorkouts

      return true;
    }

    // Deep copy
    const workouts: TodaysWorkoutsDB = JSON.parse(
      JSON.stringify(todaysWorkouts)
    );

    // If there is already data, we will update that with the current data
    // Find if the exerciseId already exists
    const existingWorkout = workouts.todaysWorkouts.find(
      (exercise: Exercise) => exercise.exerciseId === addingWorkout.exerciseId
    );

    if (existingWorkout) {
      existingWorkout.exercises.push({
        repeat: addingWorkout.repeat || 0,
        weight: addingWorkout.weight || 0,
      });

      // Create the newWorkouts array
      const newWorkouts = workouts.todaysWorkouts.map((exercise: Exercise) =>
        exercise.exerciseId === addingWorkout.exerciseId
          ? existingWorkout
          : exercise
      );

      await updateWorkouts(todaysWorkouts.documentPath, newWorkouts);

      return true;
    }

    // If there isn't a exercise in db that same as we're trying to add:
    const newWorkouts = [
      ...workouts.todaysWorkouts,
      {
        exerciseId: addingWorkout.exerciseId || 0,
        exercises: [
          {
            repeat: addingWorkout.repeat || 0,
            weight: addingWorkout.weight || 0,
          },
        ],
      },
    ];

    await updateWorkouts(todaysWorkouts.documentPath, newWorkouts);

    return true;
  };

  return useMutation({
    mutationKey: ["saveWorkout"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
    },
    mutationFn: mutationFn,
  });
}
