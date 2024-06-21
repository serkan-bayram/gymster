import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

export async function updateMeals(
  trackingsPath: string,
  newMeal: Array<Object>
): Promise<boolean | null> {
  const arrayUnion = firestore.FieldValue.arrayUnion(...newMeal);

  try {
    await firestore().doc(trackingsPath).update({ meals: arrayUnion });
    console.log("Meals is added: ", newMeal);
    return true;
  } catch (error) {
    console.log("Error on updateMeals: ", error);
    return null;
  }
}

// Returns the all meals that user has saved
export async function getAllMeals(uid: string) {
  const trackingsRef = firestore().collection("Trackings");
  const query = trackingsRef.where("uid", "==", uid).orderBy("meals", "desc");

  const querySnapshot = await query.get();

  const meals: FirebaseFirestoreTypes.DocumentData[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    meals.push(documentSnapshot.data());
  });

  return meals;
}
