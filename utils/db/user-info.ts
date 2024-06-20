import { UserInfo } from "@/app/(app)/(root)/user-info";
import firestore from "@react-native-firebase/firestore";
import { User } from "../types/session";

const usersRef = firestore().collection("Users");

// Find user document and update with user info
export async function updateUserInfo({
  userObject,
  uid,
}: {
  userObject: UserInfo;
  uid: string;
}): Promise<boolean | null> {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  if (querySnapshot.empty) {
    return null;
  }

  const documentSnapshot = querySnapshot.docs[0];
  const userPath = documentSnapshot.ref.path;
  const path = userPath.split("Users/")[1];

  try {
    await firestore()
      .collection("Users")
      .doc(path)
      .update({ info: userObject });

    return true;
  } catch (error) {
    console.log("Error on updateUserInfo: ", error);
    return false;
  }
}

export async function getUser({ uid }: { uid: string }): Promise<User> {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  const documentData = querySnapshot.docs[0].data() as User;

  return documentData;
}
