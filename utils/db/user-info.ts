import { UserInfo } from "@/app/(app)/(root)/user-info";
import firestore from "@react-native-firebase/firestore";
import { User } from "../types/session";

const usersRef = firestore().collection("Users");

interface Error {
  error: boolean;
}

// Find user document and update with user info
export async function updateUserInfo({
  userObject,
  uid,
}: {
  userObject: UserInfo;
  uid: string;
}): Promise<Error> {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  if (querySnapshot.empty) {
    return { error: true };
  }

  const documentSnapshot = querySnapshot.docs[0];
  const userPath = documentSnapshot.ref.path;
  const path = userPath.split("Users/")[1];

  try {
    await firestore()
      .collection("Users")
      .doc(path)
      .update({ info: userObject });

    return { error: false };
  } catch (error) {
    console.log("Error on updateUserInfo: ", error);
    return { error: true };
  }
}

export async function getUser({ uid }: { uid: string }): Promise<User> {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  const documentData = querySnapshot.docs[0].data() as User;

  return documentData;
}
