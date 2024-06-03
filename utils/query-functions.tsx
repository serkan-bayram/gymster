import { daysInMonth } from "./days-in-month";
import { findTrackingsDoc, getGYMDays, getRuns, getServerTime } from "./db";

// Get all runs data
export const queryGetRuns = async (uid: string | undefined) => {
  if (uid) {
    const runs = await getRuns(uid);

    if (runs && runs.length > 0) {
      return runs;
    }
  }

  return null;
};

// Get the tracking document of today
export const queryGetTrackings = async (uid: string | undefined) => {
  const serverTime = await getServerTime();

  if (serverTime && uid) {
    const foundTrackingsDoc = await findTrackingsDoc(uid, serverTime.date);

    // Trackings document is just created so there is not any value in it
    if (foundTrackingsDoc === null) {
      return null;
    }

    const { trackingsDoc } = foundTrackingsDoc;

    return trackingsDoc;
  }

  return null;
};

// The days that user went to gym
export const queryGetGYMDays = async (
  uid: string | undefined,
  setWentToGYMDays: (wentToGYMDays: number[]) => void
) => {
  const serverTime = await getServerTime();

  if (serverTime && uid) {
    // Is an array that contains day numbers that user went to gym
    const wentToGYMDays = await getGYMDays(uid, serverTime.date);

    setWentToGYMDays(wentToGYMDays);

    return { wentToGYMDays };
  }

  return null;
};

// Get calendar of current month
export const queryGetGYMCalendar = async () => {
  const serverTime = await getServerTime();

  if (serverTime) {
    const serverDate = new Date(serverTime.date.toDate());

    const daysCount = daysInMonth(
      serverDate.getMonth(),
      serverDate.getFullYear()
    );

    const todaysDate = serverDate.getDate();
    const monthName = serverDate.toLocaleString("default", {
      month: "long",
    });

    return { daysCount, todaysDate, monthName };
  }

  return null;
};
