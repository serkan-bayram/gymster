import { findUserHydration, getServerTime, updateUserHydration } from "./db";

// We check the latest hydration document and
// server time and return if they are in same day
// if they are, we can update that latest hydration document
// if not, we need to create a new one
async function checkSameDay(uid) {
  const { querySnapshot, latestHydrationDoc } = await findUserHydration(uid);

  const { serverTime } = await getServerTime();

  if (serverTime && latestHydrationDoc) {
    const hydrationDate = new Date(latestHydrationDoc.date.toDate())
      .toISOString()
      .slice(0, 10);
    const serverDate = new Date(serverTime.date.toDate())
      .toISOString()
      .slice(0, 10);

    if (hydrationDate === serverDate) {
      const documentToUpdate = querySnapshot.docs[0].ref.path;

      return { sameDay: true, documentToUpdate: documentToUpdate };
    }

    return { sameDay: false };
  }
}

export async function handleHydration(uid, newProgres = 900) {
  const { sameDay, documentToUpdate } = await checkSameDay(uid);

  // If server and latest document are in same day,
  // We can update that document with user's current progress
  if (sameDay) {
    const { success } = await updateUserHydration(documentToUpdate, newProgres);

    if (success) {
      console.log("Hydration updated!");
      return "updated";
    }
  }

  return "not updated";
}
