import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "./primary-button";
import { useRef, useState } from "react";
import { useUpdateMeals } from "@/utils/apis/meals";
import { useCloseBottomSheetOnBackPressed } from "@/utils/bottomsheet";

export function MealsBottomSheet({ setMeals, mealsBottomSheetRef }) {
  const inputRef = useRef(null);

  const setIndex = useCloseBottomSheetOnBackPressed(mealsBottomSheetRef);

  const [input, setInput] = useState("");

  const updateMeals = useUpdateMeals();

  // MAYBE separate textinput so it does not render the whole component
  const handleSave = () => {
    if (input.length <= 0) {
      closeBottomSheet();
      return;
    }

    let newMeal;

    // Add new meal to meals state
    setMeals((prevValues) => {
      newMeal = [...prevValues];

      newMeal.push({
        userInput: input,
        nutritions: {
          kcal: 342,
          protein: 13,
          fat: 27,
          carbs: 120,
        },
      });

      return newMeal;
    });

    if (newMeal) {
      updateMeals.mutate(newMeal);
    }

    closeBottomSheet();
  };

  const closeBottomSheet = () => {
    setInput("");

    mealsBottomSheetRef.current.dismiss();
  };

  return (
    <BottomSheetModal
      enablePanDownToClose={true}
      snapPoints={[500]}
      ref={mealsBottomSheetRef}
      onChange={(index) => setIndex(index)}
    >
      <BottomSheetView className="flex-1 ">
        <View className="p-5 flex gap-y-4">
          <View className="flex gap-y-2 justify-between">
            <Text className="text-lg font-bold">Öğününü anlat</Text>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              multiline
              className="border rounded-xl  p-2 h-24"
              textAlignVertical="top"
              placeholderTextColor={"gray"}
              placeholder="Ne kadar çok detay girerseniz, o kadar doğru değerler oluşur. ✨"
            />
          </View>
          <View className="flex flex-row  gap-x-4 justify-center">
            <PrimaryButton
              onPress={closeBottomSheet}
              text="Vazgeç"
              type="danger"
              className="w-1/3"
            />

            <PrimaryButton
              onPress={handleSave}
              text="Kaydet"
              className="w-1/3"
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
