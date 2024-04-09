import { Pressable, Text } from "react-native";
import { PlusSvg } from "./svg";

export function AddMeal({ mealsBottomSheetRef }) {
  return (
    <Pressable
      onPress={() => {
        mealsBottomSheetRef.current.present();
      }}
      className="mr-4 border-2  bg-primary active:bg-primary/75
       transition-all ease-in-out flex items-center justify-center
      border-secondary self-start rounded-2xl p-3 w-32 h-full"
    >
      <PlusSvg width={50} height={50} fill={"white"} />
      <Text className="text-white mt-2 font-bold">Add Meal</Text>
    </Pressable>
  );
}
