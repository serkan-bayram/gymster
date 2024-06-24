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
  identifier?: string;
  locations: LocationState[];
}

// Runs that comes from DB
export interface RunsDB {
  date?: string;
  createdAt?: FirebaseFirestoreTypes.FieldValue;
  uid: string;
  dateAsText?: string;
  runs: Run[];
  documentPath?: string;
}

export interface LocationState {
  latitude: number;
  longitude: number;
  timestamp: number;
}
