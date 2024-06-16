import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useGetTracking } from "@/utils/apis/tracking";
import { FullScreenLoading } from "@/components/loading";
import { Confetti } from "@/components/ui/confetti";

export default function Tracking() {
  const tracking = useGetTracking();

  if (tracking.isPending) return <FullScreenLoading />;

  return (
    <>
      <View className="pt-16 pb-20  px-4 bg-background ">
        <Confetti />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Heading heading={"Takip"} />
          <GYMDays />
          <Meals />
          <Water />
        </ScrollView>
      </View>
    </>
  );
}
