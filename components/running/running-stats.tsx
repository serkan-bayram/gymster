import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

// TODO: It problably does not track averageSpeed and distance in the background
export function RunningStats() {
  const { run } = useSelector((state: RootState) => state.running);

  return (
    <View className="flex flex-row justify-between">
      <View>
        <View className="flex flex-row items-center gap-x-2">
          <MaterialCommunityIcons name="speedometer" size={24} color="black" />
          <Text>Ortalama hızın</Text>
        </View>

        <Text className="text-xl  font-bold">
          {run.averageSpeed > 0
            ? `${run.averageSpeed.toFixed(1)} km/dk`
            : "Hesaplanıyor"}
        </Text>
      </View>

      <View>
        <View className="flex flex-row items-center gap-x-2">
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={24}
            color="black"
          />
          <Text>Koşulan mesafe</Text>
        </View>

        <Text className="text-xl font-bold">
          {run.distance > 0 ? `${run.distance.toFixed(1)} m` : "Hesaplanıyor"}
        </Text>
      </View>
    </View>
  );
}
