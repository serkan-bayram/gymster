import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { daysInMonth } from "../days-in-month";

// Looks timestamp's month
// Find documents that wentToGYM field is true
export async function getGYMDays(
  uid: string,
  timestamp: FirebaseFirestoreTypes.Timestamp
) {
  const givenDate = new Date(timestamp.toDate());

  const daysCount = daysInMonth(givenDate.getMonth(), givenDate.getFullYear());

  const startOfMonth = new Date(givenDate);
  startOfMonth.setDate(1);
  startOfMonth.setUTCHours(0);
  startOfMonth.setUTCMinutes(1);

  const endOfMonth = new Date(givenDate);
  endOfMonth.setDate(daysCount + 1);
  endOfMonth.setUTCHours(0);
  endOfMonth.setUTCMinutes(1);

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

export async function updateWentToGYM(
  trackingsPath: string,
  wentToGYM: boolean
) {
  await firestore()
    .doc(trackingsPath)
    .set({ wentToGYM: wentToGYM }, { merge: true });

  return true;
}
