import { getServerTime } from "./db";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

interface Timestamps {
  startTimestamp: FirebaseFirestoreTypes.Timestamp;
  endTimestamp: FirebaseFirestoreTypes.Timestamp;
}

// This function gives the start and end timestamps of serverTime
// It's useful when we want to query for a day only
export async function getTimestampsForADay(): Promise<null | Timestamps> {
  const serverTime = await getServerTime();

  if (!serverTime) return null;

  const serverTimeDate = serverTime.date;

  const startOfDay = new Date(serverTimeDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(serverTimeDate);
  endOfDay.setHours(23, 59, 59, 999);

  const startTimestamp = firestore.Timestamp.fromDate(startOfDay);
  const endTimestamp = firestore.Timestamp.fromDate(endOfDay);

  return { startTimestamp: startTimestamp, endTimestamp: endTimestamp };
}
