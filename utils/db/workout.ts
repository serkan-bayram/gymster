import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getTimestampsForADay } from "../get-timestamps-for-a-day";
import { User } from "../types/session";
import {
  AddingWorkout,
  AllWorkouts,
  DefaultExercises,
  Exercise,
  TodaysWorkoutsDB,
} from "../types/workout";

const workoutsRef = firestore().collection("Workouts");

// The default exercises that user can choose between when user wants to add a workout
export async function getDefaultExercises(): Promise<DefaultExercises> {
  const defaultExercisesRef = firestore().collection("DefaultExercises");

  const query = defaultExercisesRef.limit(1);

  const querySnapshot = await query.get();

  const documentSnapshot = querySnapshot.docs[0].data() as DefaultExercises;

  return documentSnapshot;
}

// Returns the workouts that user has done for today
export async function getTodaysWorkouts(
  user: User
): Promise<TodaysWorkoutsDB | null> {
  const timestamps = await getTimestampsForADay();

  if (!timestamps) return null;

  const { startTimestamp, endTimestamp } = timestamps;

  const query = workoutsRef
    .where("uid", "==", user.uid)
    .where("createdAt", ">=", startTimestamp)
    .where("createdAt", "<", endTimestamp)
    .limit(1);

  const querySnapshot = await query.get();

  // There is not any workout saved for today yet
  if (querySnapshot.size === 0) return null;

  const todaysWorkouts = querySnapshot.docs[0].data().workout as Exercise[];

  return {
    todaysWorkouts: todaysWorkouts,
    documentPath: querySnapshot.docs[0].ref.path,
  };
}

export async function getWorkouts(user: User): Promise<AllWorkouts[] | null> {
  const query = workoutsRef
    .where("uid", "==", user.uid)
    .orderBy("createdAt", "desc");

  const querySnapshot = await query.get();

  if (querySnapshot.size === 0) return null;

  const workouts: AllWorkouts[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    const data = documentSnapshot.data();

    const date = new Date(data.createdAt.toDate());

    const workoutObject: AllWorkouts = {
      date: {
        day: date.getDate(),
        month: date.toLocaleString("tr-TR", { month: "long" }),
        year: date.getFullYear(),
      },
      workout: data.workout,
      documentPath: documentSnapshot.ref.path,
    };

    workouts.push(workoutObject);
  });

  return workouts;
}

export async function createWorkoutDocument(
  user: User,
  addingWorkout: AddingWorkout
): Promise<void> {
  await workoutsRef.add({
    createdAt: firestore.FieldValue.serverTimestamp(),
    uid: user.uid,
    workout: [
      {
        exerciseId: addingWorkout.exerciseId,
        exercises: [
          {
            repeat: addingWorkout.repeat,
            weight: addingWorkout.weight,
            comment: addingWorkout.comment,
          },
        ],
      },
    ],
  });
}

export async function updateWorkouts(
  documentPath: string,
  updatedWorkouts: Exercise[]
): Promise<void> {
  const document = documentPath.split("Workouts/")[1];

  await workoutsRef.doc(document).update({ workout: updatedWorkouts });
}
