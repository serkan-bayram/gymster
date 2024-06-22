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

  const now = Timestamp.now().toDate();

  return JSON.stringify(now);
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
