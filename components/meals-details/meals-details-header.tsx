import { Text, View } from "react-native";
import { MealsDetailsHeaderItem } from "./meals-details-header-item";
import { Feather } from "@expo/vector-icons";
import { MealsDetailsObject } from "@/utils/types/meals";

// Details Header Container
export function MealsDetailsHeader({
  currentMeal,
}: {
  currentMeal: MealsDetailsObject | undefined;
}) {
  const sums = currentMeal?.sums;

  return (
    <View className="w-full h-52 bg-secondary rounded-b-3xl pt-12 px-2">
      <View className="w-full flex flex-row justify-between">
        <View className="flex flex-row items-center">
          <Feather name="calendar" size={20} color="white" />
          <Text className="text-background font-bold ml-1">
            {currentMeal?.day}
          </Text>
        </View>
        <Text className="text-background">Toplam Değerler</Text>
      </View>
      <View className="mt-8 flex flex-row justify-evenly">
        <MealsDetailsHeaderItem
          currentMeal={currentMeal}
          backgroundColor="#FBF3D5"
          measurement={sums?.carbs ? sums.carbs.toString() : "0"}
          type="carbs"
          iconSrc={require("@/assets/nutritions/starch.png")}
        />
        <MealsDetailsHeaderItem
          currentMeal={currentMeal}
          backgroundColor="#C4E4FF"
          measurement={sums?.protein ? sums.protein.toString() : "0"}
          type="protein"
          iconSrc={require("@/assets/nutritions/proteins.png")}
        />
        <MealsDetailsHeaderItem
          currentMeal={currentMeal}
          backgroundColor="#7ABA78"
          measurement={sums?.fat ? sums.fat.toString() : "0"}
          type="fat"
          textColor="text-background"
          iconSrc={require("@/assets/nutritions/trans-fats-free.png")}
        />
        <MealsDetailsHeaderItem
          currentMeal={currentMeal}
          backgroundColor="#A0153E"
          measurement={sums?.kcal ? sums.kcal.toString() : "0"}
          type="kcal"
          textColor="text-background"
          iconSrc={require("@/assets/nutritions/fire.png")}
        />
      </View>
    </View>
  );
}
