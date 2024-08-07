import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions";
import { getTimestampsForADay } from "../get-timestamps-for-a-day";
import { User } from "../types/session";
import {
  AddingWorkout,
  AllWorkouts,
  DefaultExercises,
  Exercise,
  ExtraWorkout,
  TodaysWorkoutsDB,
} from "../types/workout";

const workoutsRef = firestore().collection("Workouts");

// The default exercises that user can choose between when user wants to add a workout
export async function getDefaultExercises(): Promise<DefaultExercises> {
  const defaultExercisesRef = firestore()
    .collection("DefaultExercises")
    .doc("default");

  try {
    const querySnapshot = await defaultExercisesRef.get();

    if (!querySnapshot.exists) {
      const response = await functions().httpsCallable(
        "createDefaultExercises"
      )();

      if (response.data) {
        return response.data as DefaultExercises;
      }
    }

    const documentSnapshot = querySnapshot.data() as DefaultExercises;

    return documentSnapshot;
  } catch (error) {
    console.log("Error on getDefaultExercises: ", error);
    return { exercises: [] };
  }
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
  if (querySnapshot.empty) return null;

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
): Promise<boolean | null> {
  try {
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
              comment: addingWorkout.comment || "",
            },
          ],
        },
      ],
    });
    console.log("Workout document is created: ", addingWorkout);
    return true;
  } catch (error) {
    console.log("Error on createWorkoutDocument: ", error);
    return null;
  }
}

export async function updateWorkouts(
  documentPath: string,
  updatedWorkouts: Exercise[]
): Promise<boolean | null> {
  const document = documentPath.split("Workouts/")[1];

  try {
    await workoutsRef.doc(document).update({ workout: updatedWorkouts });
    console.log("Workouts updated: ", updateWorkouts);
    return true;
  } catch (error) {
    console.log("Error on updateWorkouts: ", error);
    return null;
  }
}

export async function getExtraExercises(
  user: User
): Promise<ExtraWorkout[] | null> {
  const extraExercisesRef = firestore().collection("ExtraExercises");

  const usersDocument = await extraExercisesRef
    .where("uid", "==", user.uid)
    .limit(1)
    .get();

  if (usersDocument.empty) return null;

  const usersDocumentPath = usersDocument.docs[0].ref.path;

  const usersExercisesRef = firestore().collection(
    `${usersDocumentPath}/exercises`
  );

  const usersExercises = await usersExercisesRef.get();

  if (usersExercises.empty) return null;

  const extraWorkouts: ExtraWorkout[] = [];

  usersExercises.forEach((usersExercise) => {
    const exerciseName = usersExercise.data().name;

    extraWorkouts.push({ name: exerciseName, id: usersExercise.id });
  });

  return extraWorkouts;
}

export async function saveExtraExercise(
  user: User,
  exerciseName: string
): Promise<boolean | null> {
  const extraExercisesRef = firestore().collection("ExtraExercises");

  const usersDocument = await extraExercisesRef
    .where("uid", "==", user.uid)
    .limit(1)
    .get();

  if (usersDocument.empty) {
    const documentRef = await extraExercisesRef.add({ uid: user.uid });

    const documentPath = documentRef.path;

    const exercisesCollectionRef = firestore().collection(
      `${documentPath}/exercises`
    );

    try {
      await exercisesCollectionRef.add({ name: exerciseName });
      return true;
    } catch (error) {
      console.log("Error on saveExtraExercise: ", error);
    }

    return null;
  }

  const exercisesCollectionRef = firestore().collection(
    `${usersDocument.docs[0].ref.path}/exercises`
  );

  try {
    await exercisesCollectionRef.add({ name: exerciseName });
    return true;
  } catch (error) {
    console.log("Error on saveExtraExercise: ", error);
  }

  return null;
}

export async function deleteExtraExercise(
  user: User,
  extraExercise: ExtraWorkout
): Promise<boolean | null> {
  const extraExercisesRef = firestore().collection("ExtraExercises");

  const usersDocument = await extraExercisesRef
    .where("uid", "==", user.uid)
    .limit(1)
    .get();

  if (usersDocument.empty) return null;

  const exercisesCollectionRef = firestore().collection(
    `${usersDocument.docs[0].ref.path}/exercises`
  );

  try {
    await exercisesCollectionRef.doc(extraExercise.id).delete();
    return true;
  } catch (error) {
    console.log("Error on deleteExtraExercise: ", error);
  }

  return null;
}
