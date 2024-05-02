import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const AuthContext = createContext();

// Save user to DB if it is not already saved
// We can turn this into a cloud function
const saveUser = async (user) => {
  const findUser = await firestore()
    .collection("Users")
    .where("uid", "==", user.uid)
    .get();

  if (findUser.docs.length <= 0) {
    const usersCollection = firestore().collection("Users");

    usersCollection.add(user).then(() => console.log("User is saved to DB."));
  }
};

const saveSessionToLocalStorage = async (session) => {
  try {
    // Save session to local storage
    const jsonSession = JSON.stringify(session);

    await AsyncStorage.setItem("session", jsonSession);
  } catch (error) {
    console.log("Error on saving session to local storage: ", error);
  }
};

// Read session from local storage and setSession if exists
const readStorageSession = async (setSession) => {
  try {
    const readSession = await AsyncStorage.getItem("session");

    if (readSession !== null) {
      setSession(JSON.parse(readSession));
    }
  } catch (error) {
    console.log("Can't read storage session: ", error);
  }
};

// TODO: I'dont know is AsyncStorage good for saving session
export const SessionProvider = (props) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });

    readStorageSession(setSession);

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Check for session updates, if exists navigate to somewhere
  useEffect(() => {
    if (session) {
      router.replace("/tracking");
    } else {
      router.replace("/");
    }
  }, [session]);

  function onAuthStateChanged(session) {
    if (session) {
      const user = {
        uid: session.uid,
        email: session.email,
        displayName: session.displayName,
        photoURL: session.photoURL,
      };

      saveUser(user);

      console.log("User signed in!");
    }

    setSession(session);
    saveSessionToLocalStorage(session);
  }

  const signIn = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );

      auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log("Error on sign in: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      auth()
        .signOut()
        .then(() => console.log("User signed out!"));

      // TODO: Delete async storage
    } catch (error) {
      console.error("Error on sign out: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        signIn,
        signOut,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
