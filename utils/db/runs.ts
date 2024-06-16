import firestore from "@react-native-firebase/firestore";
import { Run, RunsDB } from "../types/runs";

export async function getRuns(uid: string): Promise<RunsDB[]> {
  const runsRef = firestore().collection("Runs");
  const query = runsRef.where("uid", "==", uid).orderBy("createdAt", "desc");

  const querySnapshot = await query.get();

  const runs: RunsDB[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    let data = documentSnapshot.data() as RunsDB;

    // Get dateAsText which is something like 1 June
    const date = data.createdAt
      ? new Date(data.createdAt.toDate())
      : new Date();

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
  const runsRef = firestore().collection("Runs");

  await runsRef.add(runData);

  return true;
}

export async function updateRuns(documentPath: string, newRuns: Run[]) {
  const runsRef = firestore().collection("Runs");

  await runsRef.doc(documentPath.split("/")[1]).update({ runs: newRuns });
}
