import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { memo } from "react";
import { Text, View } from "react-native";
import { Meal } from "../meals";
import { MealDetail } from "../ui/meal-detail";
import * as Crypto from "expo-crypto";
import { cn } from "@/utils/cn";
import { Feather } from "@expo/vector-icons";

// We memoized this component because we don't want it rerender when we scroll
export const MemoizedMeals = memo(
  ({
    meals,
    mealsLayoutsRef,
  }: {
    meals: FirebaseFirestoreTypes.DocumentData[] | undefined;
    mealsLayoutsRef: any;
  }) => {
    return meals?.map((meal, index) => {
      const isLast = index + 1 === meals.length;

      return (
        <View
          onLayout={(event) => {
            if (event?.nativeEvent?.layout?.y && mealsLayoutsRef?.current) {
              const sums = meal.sums;
              const day = meal.day;
              const y = event.nativeEvent.layout.y;

              mealsLayoutsRef.current.push({ y: y, sums: sums, day: day });
            }
          }}
          key={index}
          className={cn("flex-1 mt-4 px-4", { "pb-64": isLast })}
        >
          <View className="flex flex-row items-center mb-2">
            <Feather name="calendar" size={20} color="black" />

            <Text className="text-lg font-semibold ml-1">{meal.day}</Text>
          </View>
          {meal.meals.map((detail: Meal, index: number) => {
            return <MealDetail key={Crypto.randomUUID()} detail={detail} />;
          })}
        </View>
      );
    });
  }
);
