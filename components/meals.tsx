import { FlashList } from "@shopify/flash-list";
import { cn } from "@/utils/cn";
import { Pressable, Text, View } from "react-native";
import { AddMeal } from "./ui/add-meal";
import { useRef, useState } from "react";
import { MealsBottomSheet } from "./meals-bottom-sheet";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Meal } from "@/utils/types/meals";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

type FetchedMeals = Meal[];

// We can specify the colors of meal background & texts
const colorPalattes = [
  { textColor: "text-white", color: "bg-[#453F78]" },
  { textColor: "text-white", color: "bg-[#FA7070]" },
  { textColor: "text-white", color: "bg-[#C08B5C]" },
  { textColor: "text-black", color: "bg-[#FBF3D5]" },
];

export const getColor = (index: number) => {
  // Default colors if something wents wrong while
  // choosing color palatte
  let bgColor = "bg-black";
  let textColor = "text-white";

  // Choosing the right color palatte according to
  // index of meal
  colorPalattes.forEach((palatte, palatteIndex) => {
    if (index > colorPalattes.length - 1) {
      index = index % 4;
    }

    if (palatteIndex === index) {
      bgColor = palatte.color;
      textColor = palatte.textColor;
    }
  });

  return { bgColor, textColor };
};

export function Meals() {
  const { meals: fetchedMeals } = useSelector(
    (state: RootState) => state.meals
  );

  const mealsBottomSheetRef = useRef(null);

  // We put AddMeal button instead of this placeholder
  const placeholderForAddMeal = {
    nutritions: { carbs: "", fat: "", kcal: "", protein: "" },
    userInput: "",
  };

  const [meals, setMeals] = useState<FetchedMeals>([
    placeholderForAddMeal,
    ...fetchedMeals,
  ]);

  // TODO: a better idea is start showing from reverse it should
  // go like #5, #4, ....
  return (
    <View className="flex mt-2">
      <View className="flex flex-row justify-between">
        <Text className="text-lg font-semibold mb-2">Bugün ne yedin?</Text>
        <Link href={"/meals-details"}>
          <Octicons name="link-external" size={24} color="black" />
        </Link>
      </View>

      <View className="h-32 flex flex-row">
        <FlashList
          horizontal={true}
          data={meals}
          estimatedItemSize={253}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return <AddMeal mealsBottomSheetRef={mealsBottomSheetRef} />;
            }

            const { bgColor, textColor } = getColor(index);

            // We fetch meals from firestore and firestore does
            // not guarantee any order for map types
            // Lets sort them as we want
            const newNutritions = {
              Kcal: item.nutritions["kcal"],
              Carbs: item.nutritions["carbs"],
              Protein: item.nutritions["protein"],
              Fat: item.nutritions["fat"],
            };

            return (
              <Link asChild href={"/meals-details"}>
                <Pressable
                  className={cn(
                    `mr-4 border-2 h-full max-w-[250px] active:opacity-50 transition-all  border-secondary self-start rounded-2xl p-3`,
                    bgColor
                  )}
                >
                  <Text numberOfLines={1} className={cn(`text-lg`, textColor)}>
                    <Text className="font-bold ">#{index}</Text>{" "}
                    {item.userInput}
                  </Text>

                  <View className="mt-3 flex flex-row justify-center gap-x-4">
                    {Object.keys(newNutritions).map((key, index) => {
                      return (
                        <View key={index}>
                          <Text
                            className={cn("text-center text-lg", textColor)}
                          >
                            {newNutritions[key as keyof typeof newNutritions]}
                          </Text>

                          <Text className={cn("text-center", textColor)}>
                            {key}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </Pressable>
              </Link>
            );
          }}
        />
      </View>
      <MealsBottomSheet
        setMeals={setMeals}
        mealsBottomSheetRef={mealsBottomSheetRef}
      />
    </View>
  );
}
