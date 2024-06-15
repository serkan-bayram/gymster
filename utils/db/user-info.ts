import firestore from "@react-native-firebase/firestore";

// Find user document and update with user info
export async function updateUserInfo(
  userObject: {
    age: number;
    weight: number;
    gender: string;
  },
  uid: string
) {
  const userRef = firestore().collection("Users");
  const query = userRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  querySnapshot.forEach(async (documentSnapshot) => {
    const userPath = documentSnapshot.ref.path;
    const path = userPath.split("Users/")[1];

    await firestore().collection("Users").doc(path).update(userObject);
  });
}
