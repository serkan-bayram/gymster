import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function RunningStats() {
  return (
    <View className="flex flex-row justify-between">
      <View>
        <View className="flex flex-row items-center gap-x-2">
          <MaterialCommunityIcons name="speedometer" size={24} color="black" />
          <Text>Ortalama hızın</Text>
        </View>

        <Text className="text-xl  font-bold">7.83 km/dk</Text>
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

        <Text className="text-xl  font-bold">3.4 km</Text>
      </View>
    </View>
  );
}
