import firestore from "@react-native-firebase/firestore";

/* ---- TRACKINGS ---- */

// Find a Trackings document that in "same day" within timestamp by user id
export async function findTrackingsDoc(uid, timestamp) {
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
    await trackingsRef.add({
      createdAt: new firestore.FieldValue.serverTimestamp(),
      uid: uid,
    });

    return null;
  }

  const trackingsDoc = querySnapshot.docs[0].data();

  const trackingsPath = querySnapshot.docs[0].ref.path;

  return { trackingsRef, trackingsDoc, trackingsPath };
}

/* ---- HYDRATION ---- */

export async function updateHydrationProgress(trackingsPath, newProgress) {
  await firestore()
    .doc(trackingsPath)
    .set({ hydration: { progress: parseInt(newProgress) } }, { merge: true });

  return true;
}

/* ---- STREAK ---- */

export async function updateStreak(trackingsPath, wentToGYM) {
  await firestore()
    .doc(trackingsPath)
    .set({ wentToGYM: wentToGYM }, { merge: true });

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
    date: new firestore.FieldValue.serverTimestamp(),
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
export async function getServerTime() {
  const { updated } = await updateServerTime();

  if (updated) {
    const serverTimeRef = firestore().collection("ServerTimes");

    const querySnapshot = await serverTimeRef.limit(1).get();

    const serverTime = querySnapshot.docs[0].data();

    return { serverTime };
  }
}
