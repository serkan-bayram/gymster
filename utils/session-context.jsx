import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

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

  useEffect(() => {
    if (session) {
      router.replace("/tracking");
    }
  }, [session]);

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

      if (session) {
        router.replace("/tracking");
      }

      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      setSession({ userInfo });

      try {
        const jsonValue = JSON.stringify({ userInfo });
        await AsyncStorage.setItem("session", jsonValue);
      } catch (error) {
        console.log("Error on AsyncStorage: ", error);
      }

      router.replace("/tracking");
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
