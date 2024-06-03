import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// Counter
export interface RunTime {
  hours: number;
  minutes: number;
  seconds: number;
}

// Run
export interface Run {
  averageSpeed: number;
  distance: number;
  runTime: RunTime;
}

// Runs that comes from DB
export interface RunsDB {
  createdAt: FirebaseFirestoreTypes.Timestamp;
  uid: string;
  dateAsText: string;
  runs: Run[];
}

export interface LocationState {
  latitude: number;
  longitude: number;
  timestamp: number;
}
