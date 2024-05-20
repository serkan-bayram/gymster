import { Heading } from "@/components/heading";
import { Meal, getColor } from "@/components/meals";
import { MealDetail } from "@/components/ui/meal-detail";
import { getAllMeals } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Crypto from "expo-crypto";

type DateObject = {
  day: string;
  year: number;
  meals: Meal;
};

export default function MealsDetails() {
  const { session } = useSession();
  const [meals, setMeals] = useState<FirebaseFirestoreTypes.DocumentData[]>();

  // Get all meals
  const query = useQuery({
    queryKey: ["mealsDetails"],
    queryFn: async () => {
      if (!session) {
        return null;
      }

      const meals = await getAllMeals(session.uid);

      if (meals) {
        const mealsArray: DateObject[] = [];

        // Sort meals
        meals.sort((a, b) => {
          return b.createdAt.toDate() - a.createdAt.toDate();
        });

        // Get useful information from meals and put in mealsArray
        meals.forEach((meal) => {
          const options = { month: "long", day: "numeric" } as const;

          const date = new Date(meal.createdAt.toDate());
          const day = date.toLocaleDateString("tr-TR", options);
          const year = date.getFullYear();

          // what has eaten in which date in which year
          const dateObject: DateObject = {
            day: day,
            year: year,
            meals: meal.meals,
          };

          mealsArray.push(dateObject);
        });

        setMeals(mealsArray);

        return meals;
      }

      return null;
    },
  });

  if (query.isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-16 pb-24 px-4 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading heading={"Öğün Ayrıntıları"} />
        {meals?.map((meal) => {
          return (
            <View key={Crypto.randomUUID()} className="mt-6 ">
              <Text className="text-lg font-semibold mb-3">{meal.day}</Text>
              {meal.meals.map((detail: Meal, index: number) => {
                const colors = getColor(index);

                return (
                  <MealDetail
                    colors={colors}
                    key={Crypto.randomUUID()}
                    detail={detail}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
