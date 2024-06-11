import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getTimestampsForADay } from "../get-timestamps-for-a-day";
import { DefaultExercises, WorkoutDB } from "../types/workout";
import { Alert } from "react-native";

const workoutsRef = firestore().collection("Workouts");

// Default exercises for user to pick
export function useGetDefaultExercises() {
  const queryFn = async () => {
    const defaultExercisesRef = firestore().collection("DefaultExercises");

    const query = defaultExercisesRef.limit(1);

    const querySnapshot = await query.get();

    if (querySnapshot.size === 0) return [];

    const documentData = querySnapshot.docs[0].data() as DefaultExercises;

    return documentData.exercises;
  };

  return useQuery({
    queryKey: ["getDefaultExercises"],
    queryFn: queryFn,
  });
}

// Gets the workouts that belongs to current user, for today
export function useGetTodaysWorkouts() {
  const user = useSelector((state: RootState) => state.session.user);

  if (!user) return null;

  const queryFn = async () => {
    const timestamps = await getTimestampsForADay();

    if (!timestamps) return null;

    const { startTimestamp, endTimestamp } = timestamps;

    const query = workoutsRef
      .where("uid", "==", user.uid)
      .where("createdAt", ">=", startTimestamp)
      .where("createdAt", "<", endTimestamp)
      .limit(1);

    const querySnapshot = await query.get();

    if (querySnapshot.size === 0) return null;

    let workouts: WorkoutDB | null = null;

    querySnapshot.forEach(
      (documentSnapshot) => (workouts = documentSnapshot.data().workout)
    );

    return workouts;
  };

  return useQuery({
    queryKey: ["getTodaysWorkouts"],
    queryFn: queryFn,
  });
}

export function useSaveWorkout() {
  const queryClient = useQueryClient();

  const workout = useSelector(
    (state: RootState) => state.workout.addingWorkout
  );

  const mutationFn = async () => {
    const isAnyNullExists = JSON.stringify(workout).includes("null");

    if (isAnyNullExists) {
      Alert.alert("Hata", "Lütfen bütün bilgileri doldurunuz.", [
        { text: "Tamam" },
      ]);
      return null;
    }

    console.log(workout);
  };

  return useMutation({
    mutationKey: ["saveWorkout"],
    onSuccess: async () => {
      // await queryClient.invalidateQueries({ queryKey: ["getRuns"] });
    },
    mutationFn: mutationFn,
  });
}
