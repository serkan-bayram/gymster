import firestore from "@react-native-firebase/firestore";

export async function updateHydrationProgress(
  trackingsPath: string,
  newProgress: number
) {
  await firestore()
    .doc(trackingsPath)
    .set({ hydration: { progress: newProgress } }, { merge: true });

  return true;
}
