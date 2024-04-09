import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "./primary-button";
import { useRef, useState } from "react";

export function MealsBottomSheet({ setMeals, mealsBottomSheetRef }) {
  const inputRef = useRef(null);

  const [input, setInput] = useState("");

  // MAYBE separate textinput so it does not render the whole component
  const handleSave = () => {
    // TODO: add a notification to let user know
    if (input.length <= 0) return;

    // Add new meal to meals state
    setMeals((prevValues) => {
      const newArray = [...prevValues];

      newArray.push({
        summary: input,
        calories: [
          { type: "Kcal", value: "342" },
          { type: "Protein", value: "13" },
          { type: "Fat", value: "27" },
          { type: "Carbs", value: "120" },
        ],
      });

      return newArray;
    });

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
    >
      <BottomSheetView className="flex-1 ">
        <View className="p-5 flex gap-y-4">
          <View className="flex gap-y-2 justify-between">
            <Text className="text-lg font-bold">Enter your meal</Text>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              multiline
              className="border rounded-xl  p-2 h-24"
              textAlignVertical="top"
              placeholderTextColor={"gray"}
              placeholder="More details, better results with stats. ✨"
            />
          </View>
          <View className="flex flex-row  gap-x-4 justify-center">
            <PrimaryButton
              onPress={closeBottomSheet}
              text="Cancel"
              type="danger"
              className="w-1/3"
            />

            <PrimaryButton onPress={handleSave} text="Save" className="w-1/3" />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
