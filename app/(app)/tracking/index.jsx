import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { WaterProvider } from "@/utils/water-context";
import { useSession } from "@/utils/session-context";
import { findTrackingsDoc } from "@/utils/db";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { useTime } from "@/utils/time-context";
import { ScrollView } from "react-native-gesture-handler";

// TODO: tidy up colors
export default function Tracking() {
  const { session } = useSession();
  const { serverTime } = useTime();

  const query = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
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

  if (query.isPending)
    return (
      <View className="flex-1 flex items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView className="">
      <Heading heading={"Tracking"} />
      <GYMDays fetchedWentToGYM={query.data?.wentToGYM || false} />
      <Meals fetchedMeals={query.data?.meals || []} />
      <WaterProvider>
        <Water fetchedProgress={query.data?.hydration?.progress || null} />
      </WaterProvider>
    </ScrollView>
  );
}
