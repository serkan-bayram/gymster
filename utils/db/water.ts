import firestore from "@react-native-firebase/firestore";

export async function updateHydrationProgress(
  trackingsPath: string,
  newProgress: number
) {
  try {
    await firestore()
      .doc(trackingsPath)
      .update({ hydration: { progress: newProgress } });
    console.log("Hydration progress is updated with:", newProgress);
    return true;
  } catch (error) {
    console.log("Error on updateHydrationProgress: ", error);
    return null;
  }
}
