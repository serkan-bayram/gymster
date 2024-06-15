import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { WaterProvider } from "@/utils/water-context";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useGetTracking } from "@/utils/apis/tracking";

export default function Tracking() {
  const tracking = useGetTracking();

  if (tracking.isPending)
    return (
      <View className="flex-1 flex items-center justify-center">
        <Text>Yükleniyor...</Text>
      </View>
    );

  return (
    <View className="pt-16 pb-20 px-4 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading heading={"Takip"} />
        <GYMDays />
        {/* <Meals fetchedMeals={tracking.data?.meals || []} /> */}
        {/* <WaterProvider> */}
        {/* <Water fetchedProgress={tracking.data?.hydration?.progress || null} /> */}
        {/* </WaterProvider> */}
      </ScrollView>
    </View>
  );
}
