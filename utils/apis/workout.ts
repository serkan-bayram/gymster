import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { Alert } from "react-native";
import {
  setAllWorkouts,
  setDefaultExercises,
  setTodaysWorkouts,
} from "../state/workout/workoutSlice";
import {
  createWorkoutDocument,
  getDefaultExercises,
  getTodaysWorkouts,
  getWorkouts,
  updateWorkouts,
} from "../db/workout";
import { Exercise, TodaysWorkoutsDB } from "../types/workout";
import { setNotification } from "../state/notification/notificationSlice";

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

export function useGetWorkouts() {
  const user = useSelector((state: RootState) => state.session.user);

  const dispatch = useDispatch<AppDispatch>();

  const queryFn = async () => {
    if (!user) return null;

    const workouts = await getWorkouts(user);

    dispatch(setAllWorkouts(workouts));

    if (!workouts) return null;

    return workouts;
  };

  return useQuery({
    queryKey: ["getWorkouts"],
    queryFn: queryFn,
  });
}

export function useSaveWorkout() {
  const queryClient = useQueryClient();

  const { todaysWorkouts, addingWorkout } = useSelector(
    (state: RootState) => state.workout
  );
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.session.user);

  const mutationFn = async () => {
    if (!user) return null;

    // We don't care even if comment is empty
    // So we delete it while checking
    const checkNullObject = JSON.parse(JSON.stringify(addingWorkout));

    console.log(checkNullObject);

    delete checkNullObject["comment"];

    // Did user filled all the add workout inputs
    const isAnyNullExists = JSON.stringify(checkNullObject).includes("null");

    if (isAnyNullExists) {
      dispatch(
        setNotification({
          show: true,
          text: {
            heading: "Hata",
            content:
              "Lütfen şu alanların hepsini doldurunuz: Egzersiz, Ağırlık, Tekrar",
          },
          type: "error",
        })
      );
      return null;
    }

    // First, let's check is there any workout document created?
    if (!!todaysWorkouts === false) {
      // Create one with current data if not
      const isCreated = await createWorkoutDocument(user, addingWorkout);

      if (!isCreated) {
        dispatch(
          setNotification({
            show: true,
            text: {
              heading: "Hata",
              content:
                "Hareket eklenirken bir şeyler ters gitti, daha sonra tekrar deneyiniz.",
            },
            type: "error",
          })
        );
        return null;
      }

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
        comment: addingWorkout.comment || "",
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
      {
        exerciseId: addingWorkout.exerciseId || 0,
        exercises: [
          {
            repeat: addingWorkout.repeat || 0,
            weight: addingWorkout.weight || 0,
            comment: addingWorkout.comment || "",
          },
        ],
      },
      ...workouts.todaysWorkouts,
    ];

    await updateWorkouts(todaysWorkouts.documentPath, newWorkouts);

    return true;
  };

  return useMutation({
    mutationKey: ["saveWorkout"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
      await queryClient.invalidateQueries({ queryKey: ["getWorkouts"] });
    },
    mutationFn: mutationFn,
    retry: 0,
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    workout,
    deletedWorkout,
    documentPath,
  }: {
    workout: Exercise[];
    deletedWorkout: number;
    documentPath: string;
  }) => {
    const newWorkouts = workout.filter(
      (workout) => workout.exerciseId !== deletedWorkout
    );

    return await updateWorkouts(documentPath, newWorkouts);
  };

  return useMutation({
    mutationKey: ["deleteWorkout"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getTodaysWorkouts"] });
      await queryClient.invalidateQueries({ queryKey: ["getWorkouts"] });
    },
    mutationFn: mutationFn,
  });
}
