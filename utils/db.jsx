import firestore from "@react-native-firebase/firestore";

// Every user has a document in Trackings collection
// That collects "tracking related" information
// This function finds that Trackings document
export async function findUserTrackings(uid) {
  const trackingsRef = firestore().collection("Trackings");
  const query = trackingsRef.where("uid", "==", uid);

  const querySnapshot = await query.get();

  const trackingsDocumentRef = querySnapshot.docs[0].ref;

  return { trackingsDocumentRef };
}

// There is a collection of hydration related informations
// under every Trackings collection
// This function finds that Hydration collection
export async function findUserHydration(uid) {
  const { trackingsDocumentRef } = await findUserTrackings(uid);

  const hydrationCollectionRef = trackingsDocumentRef.collection("Hydration");

  const querySnapshot = await hydrationCollectionRef.get();

  querySnapshot.forEach((documentSnapshot) => {
    console.log(documentSnapshot.data());
  });

  return "hello";
}

// // Every user has a document under Users collection
// // It looks like /Users/asdadsasddsadaasd
// // This functions returns that path
// export async function getUserDocumentPath(email) {
//   const findUser = await firestore()
//     .collection("Users")
//     .where("email", "==", email)
//     .get();

//   if (!findUser.empty) {
//     // Path of the user's document.
//     const documentPath = findUser.docs[0].ref.path;
//     return documentPath;
//   }

//   return { error: true, message: "User document path not found." };
// }

// // Get user's Trackings document
// export async function getUserTrackingDocument(email) {
//   const userDocumentPath = await getUserDocumentPath(email);

//   // We need the id of document to create ref
//   const documentId = userDocumentPath.split("/")[1];

//   const userRef = firestore().collection("Users").doc(documentId);

//   const findTracking = await firestore()
//     .collection("Trackings")
//     .where("user", "==", userRef)
//     .get();

//   const data = findTracking.docs[0].data();

//   if (data) {
//     console.log("User Trackings Document", data.deneme);
//   }

//   return "hello";
// }
