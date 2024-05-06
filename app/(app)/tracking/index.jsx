import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { WaterProvider } from "@/utils/water-context";
import { PrimaryButton } from "@/components/primary-button";
import { useSession } from "@/utils/session-context";
import { findTrackingsDoc, getServerTime } from "@/utils/db";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

// TODO: tidy up colors
// TODO: We get too many server times, maybe make a provider, loading are always same
export default function Tracking() {
  const { signOut, session } = useSession();

  const query = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      // Upddate & get server time
      const { serverTime } = await getServerTime();

      if (serverTime) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        // Trackings document is just created so there is not any value in it
        if (foundTrackingsDoc === null) {
          return null;
        }

        const { trackingsDoc } = foundTrackingsDoc;

        return trackingsDoc;
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

  return (
    <>
      <Heading heading={"Tracking"} />
      <PrimaryButton text="Log out" onPress={signOut} />
      <GYMDays fetchedWentToGYM={query.data?.wentToGYM || false} />
      <Meals fetchedMeals={query.data?.meals} />
      <WaterProvider>
        <Water fetchedProgress={query.data?.hydration?.progress || null} />
      </WaterProvider>
    </>
  );
}
