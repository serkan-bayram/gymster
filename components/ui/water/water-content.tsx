import { View } from "react-native";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { useGetAllWaterData } from "@/utils/apis/water";

export function WaterContent() {
  const data = useGetAllWaterData();

  return (
    <ScrollView horizontal>
      <View className="flex-1 px-8 w-screen flex-row  h-40 ">
        <ProgressBar />
        <UpdateWaterValue />
      </View>
      <View className="flex-1  w-screen flex-row  h-40 ">
        <View className="mx-auto">
          <LineChart />
        </View>
      </View>
    </ScrollView>
  );
}
