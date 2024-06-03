import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, TextInput, View } from "react-native";
import { PrimaryButton } from "./primary-button";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findTrackingsDoc, getServerTime, updateMeals } from "@/utils/db";
import { useSession } from "@/utils/session-context";

export function MealsBottomSheet({ setMeals, mealsBottomSheetRef }) {
  const inputRef = useRef(null);

  const [input, setInput] = useState("");

  const { session } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tracking", "mealsDetails"],
      });
    },
    mutationFn: async (newMeal) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        // Remove empty {} at first index
        const shifted = [...newMeal];
        shifted.shift();

        const { trackingsPath } = foundTrackingsDoc;

        const isUpdated = await updateMeals(trackingsPath, shifted);
      }
    },
  });

  // MAYBE separate textinput so it does not render the whole component
  const handleSave = () => {
    // TODO: add a notification to let user know
    if (input.length <= 0) return;

    let newMeal;

    // Add new meal to meals state
    setMeals((prevValues) => {
      newMeal = [...prevValues];

      newMeal.push({
        userInput: input,
        nutritions: {
          kcal: "342",
          protein: "13",
          fat: "27",
          carbs: "120",
        },
      });

      return newMeal;
    });

    if (newMeal) {
      mutation.mutate(newMeal);
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
