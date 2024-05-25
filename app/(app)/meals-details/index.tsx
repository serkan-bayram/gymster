import { Meal } from "@/components/meals";
import { MealDetail } from "@/components/ui/meal-detail";
import { getAllMeals } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Crypto from "expo-crypto";
import { Image, ImageSource } from "expo-image";
import { cn } from "@/utils/cn";
import { Feather } from "@expo/vector-icons";

type DateObject = {
  day: string;
  year: number;
  meals: Meal;
};

function MealsDetailsHeaderItem({
  measurement,
  type,
  backgroundColor,
  iconSrc,
  textColor,
}: {
  measurement: string;
  type: string;
  backgroundColor: string;
  iconSrc: ImageSource;
  textColor?: string;
}) {
  return (
    <View
      className={cn(
        "bg-primary pr-6 py-2 pl-2 w-20 rounded-lg",
        backgroundColor
      )}
    >
      <View className="w-6 h-6">
        <Image source={iconSrc} className="flex-1" contentFit="cover" />
      </View>
      <View className="flex mt-1">
        <View className="flex">
          <Text className={cn("font-bold", textColor)}>{measurement}</Text>
          <Text className={cn("", textColor)}>{type}</Text>
        </View>
      </View>
    </View>
  );
}

function MealsDetailsHeader() {
  return (
    <View className="w-full h-52 bg-green-600 rounded-b-3xl pt-12 px-2">
      <View className="w-full flex flex-row justify-between">
        <View className="flex flex-row items-center">
          <Feather name="calendar" size={20} color="white" />
          <Text className="text-background font-bold ml-1">20 Mayıs</Text>
        </View>
        <Text className="text-green-200">Toplam Değerler</Text>
      </View>
      <View className="mt-8 flex flex-row justify-evenly">
        <MealsDetailsHeaderItem
          backgroundColor="bg-primary"
          measurement="320"
          type="carbs"
          iconSrc={require("@/assets/nutritions/starch.png")}
        />
        <MealsDetailsHeaderItem
          backgroundColor="bg-lightBlue"
          measurement="320"
          type="protein"
          iconSrc={require("@/assets/nutritions/proteins.png")}
        />
        <MealsDetailsHeaderItem
          backgroundColor="bg-secondary"
          measurement="320"
          type="fat"
          textColor="text-background"
          iconSrc={require("@/assets/nutritions/trans-fats-free.png")}
        />
        <MealsDetailsHeaderItem
          backgroundColor="bg-background"
          measurement="320"
          type="kcal"
          iconSrc={require("@/assets/nutritions/fire.png")}
        />
      </View>
    </View>
  );
}

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
    <View className="flex-1 pb-24  bg-background">
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <MealsDetailsHeader />
        {meals?.map((meal) => {
          return (
            <View key={Crypto.randomUUID()} className="flex-1 mt-4 px-4">
              <Text className="text-lg font-semibold mb-2">{meal.day}</Text>
              {meal.meals.map((detail: Meal, index: number) => {
                return <MealDetail key={Crypto.randomUUID()} detail={detail} />;
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
