import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
const AuthContext = createContext();

export const SessionProvider = (props) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);

      if (session) {
        router.replace("/tracking");
      }

      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      setSession({ userInfo });

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
