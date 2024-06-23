import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MealsDetailsHeader } from "@/components/meals-details/meals-details-header";
import { MemoizedMeals } from "@/components/meals-details/memoized-meals";
import { DateObject, MealsDetailsObject } from "@/utils/types/meals";
import { useGetMeals } from "@/utils/apis/meals";
import { FullScreenLoading } from "@/components/loading";

export default function MealsDetails() {
  const [meals, setMeals] = useState<DateObject[]>();

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

  const getMeals = useGetMeals({
    setCurrentMeal: setCurrentMeal,
    setMeals: setMeals,
  });

  // || !currentMeal
  if (getMeals.isPending) {
    return <FullScreenLoading />;
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
        {!meals || meals?.length === 0 ? (
          <View className="flex-1 flex items-center justify-center mt-24">
            <Text className="font-semibold text-lg">
              Öğün verisi bulunamadı.
            </Text>
          </View>
        ) : (
          <MemoizedMeals meals={meals} mealsLayoutsRef={mealsLayoutsRef} />
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}
