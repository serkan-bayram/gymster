import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { getServerTime } from "./db";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

const TimeContext = createContext<{
  serverTime: FirebaseFirestoreTypes.DocumentData | null;
  isLoading: boolean;
}>({
  serverTime: null,
  isLoading: true,
});

// This context provides trustable server time
export const TimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [serverTime, setServerTime] =
    useState<FirebaseFirestoreTypes.DocumentData | null>(null);

  const query = useQuery({
    queryKey: ["time"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      setServerTime(serverTime);

      return serverTime;
    },
  });

  return (
    <TimeContext.Provider
      value={{ serverTime: serverTime, isLoading: query.isLoading }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
