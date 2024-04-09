import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const AuthContext = createContext();

export const SessionProvider = (props) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      setSession(user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
