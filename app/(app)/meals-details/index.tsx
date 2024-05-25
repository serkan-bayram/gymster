import { Meal } from "@/components/meals";
import { getAllMeals } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MealsDetailsHeader } from "@/components/meals-details/meals-details-header";
import { MemoizedMeals } from "@/components/meals-details/memoized-meals";

type Sums = {
  carbs: number;
  protein: number;
  fat: number;
  kcal: number;
};

type DateObject = {
  day: string;
  year: number;
  meals: Meal;
  sums: Sums;
};

export type MealsDetailsObject = {
  y?: number;
  day: string;
  sums: Sums;
};

export default function MealsDetails() {
  const { session } = useSession();
  const [meals, setMeals] = useState<FirebaseFirestoreTypes.DocumentData[]>();

  // How much we scrolled, header is calculated
  const [scrollViewY, setScrollViewY] = useState<number>(0);

  // The meal that we show on the header
  const [currentMeal, setCurrentMeal] = useState<MealsDetailsObject>();

  // This array have the position y of days
  const mealsLayoutsRef = useRef<MealsDetailsObject[]>([]);

  useEffect(() => {
    if (mealsLayoutsRef.current.length > 0) {
      // Meals that we passed via scrolling
      const biggerThan: MealsDetailsObject[] = [];

      const layoutsArray = mealsLayoutsRef.current;

      layoutsArray.forEach((layout) => {
        if (layout.y) {
          if (scrollViewY + 100 > layout.y) {
            biggerThan.push(layout);
          }
        }
      });

      // .at(-1) is the one that we should show to the user
      setCurrentMeal(biggerThan.at(-1));
    }
  }, [scrollViewY, mealsLayoutsRef.current.length]);

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

          const sums: Sums = {
            carbs: 0,
            protein: 0,
            fat: 0,
            kcal: 0,
          };

          meal.meals.forEach((meal: Meal) => {
            const nutritions = meal?.nutritions;

            sums.carbs += parseFloat(nutritions?.carbs);
            sums.protein += parseFloat(nutritions?.protein);
            sums.fat += parseFloat(nutritions?.fat);
            sums.kcal += parseFloat(nutritions?.kcal);
          });

          // what has eaten in which date in which year
          const dateObject: DateObject = {
            day: day,
            year: year,
            meals: meal.meals,
            sums: sums,
          };

          mealsArray.push(dateObject);
        });

        // We show this on first mount
        const currentMeal: MealsDetailsObject = {
          day: mealsArray[0].day,
          sums: mealsArray[0].sums,
        };

        setCurrentMeal(currentMeal);
        setMeals(mealsArray);

        return meals;
      }

      return null;
    },
  });

  if (query.isPending || !currentMeal) {
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
        onScroll={(event) => {
          const layout = event.nativeEvent.contentOffset;

          // 208 is the height of MealsDetailsHeader
          setScrollViewY(layout.y + 208);
        }}
      >
        <MealsDetailsHeader currentMeal={currentMeal} />
        <MemoizedMeals meals={meals} mealsLayoutsRef={mealsLayoutsRef} />
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}
