import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getTimestampsForADay } from "../get-timestamps-for-a-day";

const trackingsRef = firestore().collection("Trackings");

// Find a Trackings document that in "same day" within timestamp by user id
export async function findTrackingsDoc(uid: string) {
  const timestamps = await getTimestampsForADay();

  if (!timestamps) return null;

  const { startTimestamp, endTimestamp } = timestamps;

  const query = trackingsRef
    .where("uid", "==", uid)
    .where("createdAt", ">=", startTimestamp)
    .where("createdAt", "<", endTimestamp)
    .limit(1);

  const querySnapshot = await query.get();

  // Create document if not exists
  if (querySnapshot.size === 0) {
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
