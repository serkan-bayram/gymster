import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Run, RunsDB } from "../types/runs";
import functions from "@react-native-firebase/functions";

export async function getRuns(uid: string): Promise<RunsDB[]> {
  const runsRef = firestore().collection("Runs");
  const query = runsRef.where("uid", "==", uid).orderBy("createdAt", "desc");

  const querySnapshot = await query.get();

  const runs: RunsDB[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    let data = documentSnapshot.data() as RunsDB;

    const createdAt = data.createdAt as FirebaseFirestoreTypes.Timestamp;

    // Get dateAsText which is something like 1 June
    const date = createdAt ? new Date(createdAt.toDate()) : new Date();

    const month = date.toLocaleDateString("tr-TR", { month: "long" });
    const day = date.getUTCDate();

    const dateAsText = `${day} ${month}`;

    data = {
      date: `${date}`,
      uid: data.uid,
      runs: data.runs,
      dateAsText: dateAsText,
      documentPath: documentSnapshot.ref.path,
    };

    runs.push(data);
  });

  return runs;
}

export async function saveRun(runData: RunsDB) {
  try {
    const isSaved = await functions().httpsCallable("createRuns")({
      saveObject: runData,
    });

    console.log("isSaved: ", isSaved);
    return isSaved;
  } catch (error) {
    console.log("Error on saveRun: ", saveRun);
    return null;
  }
}

export async function updateRuns(documentPath: string, newRuns: Run[]) {
  try {
    const isSaved = await functions().httpsCallable("createRuns")({
      saveObject: newRuns,
      documentPath: documentPath,
    });

    console.log("isSaved: ", isSaved);
    return isSaved;
  } catch (error) {
    console.log("Error on saveRun: ", saveRun);
    return null;
  }
}
