import { View } from "react-native";
import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useState } from "react";
import { WaterProvider } from "@/utils/water-context";

export default function Tracking() {
  const mealsBottomSheet = useRef(null);

  // This will come from DB
  const mealsDB = [
    {}, // Don't delete this, this a placeholder for add meal section
    {
      summary: "Eggs, Rice, Yoghurt",
      calories: [
        { type: "Kcal", value: "342" },
        { type: "Protein", value: "13" },
        { type: "Fat", value: "27" },
        { type: "Carbs", value: "120" },
      ],
    },
    {
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
  ];

  const [meals, setMeals] = useState(mealsDB);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="pt-9  flex-1 gap-y-4 bg-background">
        <Heading heading={"Tracking"} />
        <GYMDays />
        <Meals meals={meals} mealsBottomSheet={mealsBottomSheet} />
        <WaterProvider>
          <Water />
        </WaterProvider>
      </View>
    </GestureHandlerRootView>
  );
}
