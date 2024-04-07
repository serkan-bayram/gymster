import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "./primary-button";
import { useRef, useState } from "react";
import { Keyboard } from "react-native";

export function MealsBottomSheet({ setMeals, mealsBottomSheet }) {
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  // MAYBE separate textinput so it does not render the whole component
  const handlePress = () => {
    // TODO: add a notification to let user know
    if (input.length <= 0) return;

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

    setInput("");

    Keyboard.dismiss();

    setTimeout(() => {
      mealsBottomSheet.current.close();
    }, 500);
  };

  return (
    <BottomSheet
      android_keyboardInputMode="adjustResize"
      index={-1}
      enablePanDownToClose={true}
      snapPoints={[100, 500]}
      ref={mealsBottomSheet}
    >
      <BottomSheetView className="flex-1">
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
              onPress={() => {
                setInput("");
                Keyboard.dismiss();

                setTimeout(() => {
                  mealsBottomSheet.current.close();
                }, 500);
              }}
              text="Cancel"
              type="danger"
              className="w-1/3"
            />
            <PrimaryButton
              onPress={handlePress}
              text="Save"
              className="w-1/3"
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
