import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { daysInMonth } from "./days-in-month";

/* ---- TRACKINGS ---- */

// Find a Trackings document that in "same day" within timestamp by user id
export async function findTrackingsDoc(
  uid: string,
  timestamp: FirebaseFirestoreTypes.Timestamp
) {
  const givenDate = new Date(timestamp.toDate());

  const startOfDay = new Date(givenDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(givenDate);
  endOfDay.setHours(23, 59, 59, 999);

  const startTimestamp = firestore.Timestamp.fromDate(startOfDay);
  const endTimestamp = firestore.Timestamp.fromDate(endOfDay);

  const trackingsRef = firestore().collection("Trackings");
  const query = trackingsRef
    .where("uid", "==", uid)
    .where("createdAt", ">=", startTimestamp)
    .where("createdAt", "<", endTimestamp)
    .limit(1);

  const querySnapshot = await query.get();

  // Create document if not exists
  if (querySnapshot.size === 0) {
    // TODO: I removed the new keyword but I don't know will it work
    await trackingsRef.add({
      createdAt: firestore.FieldValue.serverTimestamp(),
      uid: uid,
    });

    return null;
  }

  const trackingsDoc = querySnapshot.docs[0].data();

  const trackingsPath = querySnapshot.docs[0].ref.path;

  return { trackingsRef, trackingsDoc, trackingsPath };
}

/* ---- HYDRATION ---- */

export async function updateHydrationProgress(
  trackingsPath: string,
  newProgress: number
) {
  await firestore()
    .doc(trackingsPath)
    .set({ hydration: { progress: newProgress } }, { merge: true });

  return true;
}

/* ---- GYM DAYS ---- */

export async function updateWentToGYM(
  trackingsPath: string,
  wentToGYM: boolean
) {
  await firestore()
    .doc(trackingsPath)
    .set({ wentToGYM: wentToGYM }, { merge: true });

  return true;
}

// Find documents that wentToGYM field is true
// Looks timestamp's month
export async function getGYMDays(
  uid: string,
  timestamp: FirebaseFirestoreTypes.Timestamp
) {
  const givenDate = new Date(timestamp.toDate());

  const daysCount = daysInMonth(givenDate.getMonth(), givenDate.getFullYear());

  const startOfMonth = new Date(givenDate);
  startOfMonth.setDate(2);
  const endOfMonth = new Date(givenDate);
  endOfMonth.setDate(daysCount + 1);

  const startTimestamp = firestore.Timestamp.fromDate(startOfMonth);
  const endTimestamp = firestore.Timestamp.fromDate(endOfMonth);

  const trackingsRef = firestore().collection("Trackings");
  const query = trackingsRef
    .where("uid", "==", uid)
    .where("createdAt", ">=", startTimestamp)
    .where("createdAt", "<", endTimestamp)
    .where("wentToGYM", "==", true);

  const querySnapshot = await query.get();

  const wentToGYMDays: Array<number> = [];

  querySnapshot.forEach((documentSnapshot) => {
    const { createdAt } = documentSnapshot.data();

    const date = new Date(createdAt.toDate());

    wentToGYMDays.push(date.getDate());
  });

  return wentToGYMDays;
}

/* ---- USER INFO ---- */

// Find user document and update with user info
export async function updateUserInfo(
  userObject: {
    age?: number;
    weight?: number;
    gender?: string;
  },
  uid: string
) {
  const userRef = firestore().collection("Users");
  const query = userRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  querySnapshot.forEach(async (documentSnapshot) => {
    const userPath = documentSnapshot.ref.path;
    const path = userPath.split("Users/")[1];

    await firestore().collection("Users").doc(path).update(userObject);
  });
}

/* ---- MEALS ---- */

export async function updateMeals(
  trackingsPath: string,
  newMeal: Array<Object>
) {
  const arrayUnion = firestore.FieldValue.arrayUnion(...newMeal);

  await firestore().doc(trackingsPath).update({ meals: arrayUnion });

  return true;
}

/* ---- SERVER TIME ---- */

// We have a document in the firestore that holds a timestamp
// We need to update it with server time whenever we need trustable time
export async function updateServerTime() {
  const serverTimeRef = firestore().collection("ServerTimes");

  // There is only one document that holds this information
  const querySnapshot = await serverTimeRef.limit(1).get();

  const serverTimeObject = {
    date: firestore.FieldValue.serverTimestamp(),
  };

  // We create first, if no document exists
  if (querySnapshot.size === 0) {
    await serverTimeRef.add(serverTimeObject);
  } else {
    // We update the document with latest server time
    const documentToUpdate = querySnapshot.docs[0].ref.path;

    await firestore().doc(documentToUpdate).update(serverTimeObject);
  }

  return { updated: true };
}

// We can use cloud functions instead of updateServerTime
export async function getServerTime(): Promise<FirebaseFirestoreTypes.DocumentData | null> {
  const { updated } = await updateServerTime();

  if (updated) {
    const serverTimeRef = firestore().collection("ServerTimes");

    const querySnapshot = await serverTimeRef.limit(1).get();

    const serverTime = querySnapshot.docs[0].data();

    return serverTime;
  }

  return null;
}
