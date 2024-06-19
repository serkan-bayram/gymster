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
}) {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  querySnapshot.forEach(async (documentSnapshot) => {
    const userPath = documentSnapshot.ref.path;
    const path = userPath.split("Users/")[1];

    await firestore()
      .collection("Users")
      .doc(path)
      .update({ info: userObject });
  });
}

export async function getUser({ uid }: { uid: string }): Promise<User> {
  const query = usersRef.where("uid", "==", uid).limit(1);

  const querySnapshot = await query.get();

  const documentData = querySnapshot.docs[0].data() as User;

  return documentData;
}
