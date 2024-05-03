import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { WaterProvider } from "@/utils/water-context";
import { PrimaryButton } from "@/components/primary-button";
import { useSession } from "@/utils/session-context";
import { findTrackingsDoc, getServerTime } from "@/utils/db";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text, View } from "react-native";

// TODO: tidy up colors
export default function Tracking() {
  const { signOut, session } = useSession();

  const query = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      const { serverTime } = await getServerTime();

      if (serverTime) {
        const { trackingsDoc } = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        console.log("Trackings doc: ", trackingsDoc);

        if (!!trackingsDoc.hydration) {
          const fetchedProgress = trackingsDoc.hydration;

          return { fetchedProgress };
        }
      }

      return null;
    },
  });

  // TODO: isFetching vs isLoading vs isPending LEARN
  if (query.isFetching)
    return (
      <View className="flex-1 flex items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );

  const { fetchedProgress } = query.data;

  return (
    <>
      <Heading heading={"Tracking"} />
      <PrimaryButton text="Log out" onPress={signOut} />
      <GYMDays />
      <Meals />
      <WaterProvider>
        <Water progress={fetchedProgress} />
      </WaterProvider>
    </>
  );
}
