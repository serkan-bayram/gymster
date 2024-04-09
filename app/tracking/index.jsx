import { View } from "react-native";
import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WaterProvider } from "@/utils/water-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Tracking() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <View className="pt-9 flex-1 gap-y-4 bg-background">
          <Heading heading={"Tracking"} />
          <GYMDays />
          <Meals />

          <WaterProvider>
            <Water />
          </WaterProvider>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
