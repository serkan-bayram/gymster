import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getTimestampsForADay } from "../get-timestamps-for-a-day";
import { Meal } from "../types/meals";

const trackingsRef = firestore().collection("Trackings");

interface TrackingsDoc {
  createdAt: FirebaseFirestoreTypes.Timestamp;
  wentToGYM?: boolean;
  hydration?: {
    progress: number;
  };
  meals?: Meal[];
}

interface Trackings extends FirebaseFirestoreTypes.DocumentData {
  trackingsRef: FirebaseFirestoreTypes.CollectionReference;
  trackingsDoc: TrackingsDoc;
  trackingsPath: string;
}

// Find a Trackings document that in "same day" within timestamp by user id
export async function findTrackingsDoc(uid: string): Promise<Trackings | null> {
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
  if (querySnapshot.empty) {
    try {
      await trackingsRef.add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        uid: uid,
      });
      console.log("Tracking document is created.");
    } catch (error) {
      console.log("Error on findTrackingsDoc: ", error);
    }

    return null;
  }

  const trackingsDoc = querySnapshot.docs[0].data() as TrackingsDoc;

  const trackingsPath = querySnapshot.docs[0].ref.path;

  return {
    trackingsRef: trackingsRef,
    trackingsDoc: trackingsDoc,
    trackingsPath: trackingsPath,
  };
}

export async function getAllTrackings({ uid }: { uid: string }) {
  const query = trackingsRef.where("uid", "==", uid);

  const querySnapshot = await query.get();

  if (querySnapshot.size === 0) return null;

  const data: TrackingsDoc[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    const trackingsDoc = documentSnapshot.data() as TrackingsDoc;

    data.push(trackingsDoc);
  });

  return data;
}
