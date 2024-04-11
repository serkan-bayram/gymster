import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";

const AuthContext = createContext();

// TODO: I'dont know is AsyncStorage good for saving session
export const SessionProvider = (props) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });

    readStorageSession();
  }, []);

  // Check for session updates, if exists navigate to somewhere
  useEffect(() => {
    if (session) {
      router.replace("/tracking");
    } else {
      router.replace("/");
    }
  }, [session]);

  // Read session from local storage and setSession if exists
  const readStorageSession = async () => {
    try {
      const value = await AsyncStorage.getItem("session");

      if (value !== null) {
        setSession(JSON.parse(value));
      }
    } catch (error) {
      console.log("Can't read storage session: ", error);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);

      // Extra check, if session exists navigate somewhere
      if (session) {
        router.replace("/tracking");
      }

      // react native google signin codes
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      // Save user to firebase authentication
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );

      auth().signInWithCredential(googleCredential);

      try {
        // Save session to local storage
        const jsonValue = JSON.stringify({ userInfo });

        await AsyncStorage.setItem("session", jsonValue);
      } catch (error) {
        console.log("Error on AsyncStorage: ", error);
      }

      // Setting session with user info
      setSession({ userInfo });
    } catch (error) {
      console.log("Error on sign in: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      await GoogleSignin.signOut();

      setSession(null);
      // TODO: Delete async storage

      // TODO: We should need extra codes with
      // signOut, check react native google signin package
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
