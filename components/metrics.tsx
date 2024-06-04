import { Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Metric } from "@/components/metric";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";

export function Metrics() {
  const [currentStepCount, setCurrentStepCount] = useState(0);

  return (
    <View className="mt-6 ">
      <Text className="text-lg font-semibold mb-2">Ölçümler</Text>
      <View className="flex flex-row ">
        <Metric
          heading="Yakılan kalori"
          measurement="400"
          type="Kcal"
          iconComponent={<FontAwesome5 name="burn" size={23} color="white" />}
          iconBackgroundColor="bg-[#A0153E]"
        />
        <Metric
          heading="Adım sayısı"
          measurement={currentStepCount.toString()}
          type=""
          iconComponent={
            <FontAwesome5 name="walking" size={24} color="white" />
          }
          iconBackgroundColor="bg-[#7ABA78]"
        />
      </View>
    </View>
  );
}
