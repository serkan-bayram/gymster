import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  session: FirebaseAuthTypes.User | null;
  setSession: React.Dispatch<
    React.SetStateAction<FirebaseAuthTypes.User | null>
  >;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  setSession: () => {},
  signIn: async () => {},
  signOut: async () => {},
  loading: false,
  setLoading: () => {},
});

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

// Save user to DB if it is not already saved
// We can turn this into a cloud function
const saveUser = async (user: User) => {
  const findUser = await firestore()
    .collection("Users")
    .where("uid", "==", user.uid)
    .get();

  if (findUser.docs.length <= 0) {
    const usersCollection = firestore().collection("Users");

    usersCollection.add(user).then(() => console.log("User is saved to DB."));
  }
};

const saveSessionToLocalStorage = async (
  session: FirebaseAuthTypes.User | null
) => {
  try {
    // Save session to local storage
    const jsonSession = JSON.stringify(session);

    await AsyncStorage.setItem("session", jsonSession);
  } catch (error) {
    console.log("Error on saving session to local storage: ", error);
  }
};

// Read session from local storage and setSession if exists
const readStorageSession = async (
  setSession: React.Dispatch<
    React.SetStateAction<FirebaseAuthTypes.User | null>
  >
) => {
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
export const SessionProvider = (props: React.PropsWithChildren) => {
  const [session, setSession] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Check is user info screen skipped before
  const [didSkipped, setDidSkipped] = useState<string | null>(null);

  const checkDidSkipped = async () => {
    const didSkipped = await AsyncStorage.getItem("skipped");
    setDidSkipped(didSkipped);

    return true;
  };

  useQuery({
    queryKey: ["skip"],
    queryFn: checkDidSkipped,
  });

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
      if (didSkipped) {
        router.replace("/home");
      } else {
        router.replace("/userInfo");
      }
    } else {
      router.replace("/");
    }
  }, [session]);

  function onAuthStateChanged(session: FirebaseAuthTypes.User | null) {
    if (session) {
      // This user object will be saved to db
      const user: User = {
        uid: session.uid,
        email: session.email || "",
        displayName: session.displayName || null,
        photoURL: session.photoURL || null,
      };

      saveUser(user);

      console.log("User signed in!");
    }

    setSession(session ? session : null);
    saveSessionToLocalStorage(session);
  }

  const signIn = async () => {
    try {
      setLoading(true);

      // Set local storage if UserInfo screen has skipped before
      await checkDidSkipped();

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

      GoogleSignin.revokeAccess();

      auth()
        .signOut()
        .then(async () => {
          await AsyncStorage.removeItem("session");

          console.log("User signed out!");
        });
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
