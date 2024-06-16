import { Heading } from "@/components/heading";
import { RootState } from "@/utils/state/store";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

export default function Stat() {
  const runs = useSelector((state: RootState) => state.running.allRuns);
  console.log("runs: ", runs);

  return (
    <ScrollView className="pt-16 pb-20 px-4 bg-background flex-1 ">
      <Heading heading="Koşu İstatisikleri" />
      <View className="mt-4">
        <View className="mb-4">
          <Text className="font-semibold text-lg">Mesafe</Text>
        </View>
        <LineChart data={data} />
      </View>
    </ScrollView>
  );
}
