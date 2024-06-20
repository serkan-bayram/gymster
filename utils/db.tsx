import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

/* ---- SERVER TIME ---- */

// We have a document in the firestore that holds a timestamp
// We need to update it with server time whenever we need trustable time
export async function updateServerTime(): Promise<boolean | null> {
  const serverTimeRef = firestore().collection("ServerTimes");

  // There is only one document that holds this information
  const querySnapshot = await serverTimeRef.limit(1).get();

  const serverTimeObject = {
    date: firestore.FieldValue.serverTimestamp(),
  };

  // We create first, if no document exists
  if (querySnapshot.size === 0) {
    try {
      await serverTimeRef.add(serverTimeObject);
      return true;
    } catch (error) {
      console.log("Error on updateServerTime: ", error);
      return null;
    }
  }

  // We update the document with latest server time
  const documentToUpdate = querySnapshot.docs[0].ref.path;

  try {
    await firestore().doc(documentToUpdate).update(serverTimeObject);
    return true;
  } catch (error) {
    console.log("Error on updateServerTime: ", error);
    return null;
  }
}

interface ServerTime {
  date: FirebaseFirestoreTypes.Timestamp;
}

// We can use cloud functions instead of updateServerTime
export async function getServerTime(): Promise<null | ServerTime> {
  const isUpdated = await updateServerTime();

  if (isUpdated) {
    const serverTimeRef = firestore().collection("ServerTimes");

    const querySnapshot = await serverTimeRef.limit(1).get();

    const serverTime = querySnapshot.docs[0].data() as {
      date: FirebaseFirestoreTypes.Timestamp;
    };

    return serverTime;
  }

  return null;
}
