/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall } from "firebase-functions/v2/https";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";
import axios from "axios";

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Creates a user in firestore whenever a new user signs in
export const createUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const userData = request.data;

  const usersCollection = getFirestore().collection("Users");

  try {
    await usersCollection.add(userData);
    return true;
  } catch (error) {
    console.log("Error on createUser: ", error);
    return null;
  }
});

export const getServerTime = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  try {
    const now = Timestamp.now().toDate();
    console.log("getServerTime Cloud Function ran: ", now);
    return JSON.stringify(now);
  } catch (error) {
    console.log("Error on getServerTime: ", error);
    return null;
  }
});

// I feel like it's a bit slow and overkill
// We need to rearrange database
// Write comments and tidy up this function if you are not going to fix
export const createRuns = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const areKeysCorrect =
    request.data.saveObject.hasOwnProperty("createdAt") &&
    request.data.saveObject.hasOwnProperty("uid") &&
    request.data.saveObject.hasOwnProperty("runs");

  const isUIDCorrect = request.data.saveObject.uid === request.auth.uid;

  if (!!request.data.documentPath === false) {
    if (!areKeysCorrect) return null;
    if (!isUIDCorrect) return null;
  }

  const runs = !!request.data.documentPath
    ? request.data.saveObject
    : request.data.saveObject.runs;

  const areRunsCorrect = runs.map((run: any) => {
    const areKeysCorrect =
      run.hasOwnProperty("identifier") &&
      run.hasOwnProperty("averageSpeed") &&
      run.hasOwnProperty("runTime") &&
      run.hasOwnProperty("distance");

    const runTime = run?.runTime;
    const isRunTimeCorrect =
      runTime.hasOwnProperty("hours") &&
      runTime.hasOwnProperty("minutes") &&
      runTime.hasOwnProperty("seconds") &&
      runTime.hours < 500 &&
      runTime.hours >= 0 &&
      runTime.minutes <= 60 &&
      runTime.minutes >= 0 &&
      runTime.seconds <= 60 &&
      runTime.seconds >= 0;

    const isAverageSpeedCorrect =
      run.averageSpeed < 100 && run.averageSpeed >= 0;
    const isDistanceCorrect = run.distance < 10000 && run.distance >= 0;

    return (
      areKeysCorrect &&
      isRunTimeCorrect &&
      isAverageSpeedCorrect &&
      isDistanceCorrect
    );
  });

  if (areRunsCorrect.includes(false)) {
    return null;
  }

  const saveObject = JSON.parse(JSON.stringify(request.data.saveObject));

  saveObject.createdAt = Timestamp.now();

  const ref = getFirestore().collection("Runs");

  if (!!request.data.documentPath) {
    console.log(saveObject);
    await ref
      .doc(request.data.documentPath.split("/")[1])
      .update({ runs: saveObject });
    return true;
  }

  await ref.add(saveObject);

  return true;
});

export const createDefaultExercises = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // TODO: Will fetch this from somewhere, or save it in database
  const exercises = [
    { id: 0, name: "Chest Press" },
    { id: 1, name: "Squat" },
  ];

  const defaultExercisesCollection =
    getFirestore().collection("DefaultExercises");

  try {
    await defaultExercisesCollection.add({ exercises: exercises });
    return { exercises: exercises };
  } catch (error) {
    console.log("Error on createDefaultExercises: ", error);
    return null;
  }
});

export const getGoogleMapsAPIKey = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // TODO: DO NOT PUT YOUR API KEY IN .ENV THERE ARE OTHER WAYS LIKE SECRET MANAGER
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  return GOOGLE_MAPS_API_KEY;
});

export interface LocationState {
  latitude: number;
  longitude: number;
  timestamp: number;
}

// Returns the distance and duration between two locations
// We use this function to calculate user's average speed and distance
export const getDistanceBetweenTwoLocations = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // Sent by user, location at the start and last known location
  const locations: LocationState[] | null = request.data.locations;

  if (!locations) return null;

  const origins = locations[0];
  const destinations = locations[1];

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  const requestURL = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations.latitude},${destinations.longitude}&origins=${origins.latitude},${origins.longitude}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios({
      method: "get",
      url: requestURL,
    });

    if (response.data) {
      const rows = response.data.rows;

      if (rows) {
        const row = rows[0].elements[0];

        return { distance: row.distance.text, duration: row.duration.text };
      }
    }

    return null;
  } catch (error) {
    console.log("Error on getDistanceBetweenTwoLocations: ", error);
    return null;
  }
});
