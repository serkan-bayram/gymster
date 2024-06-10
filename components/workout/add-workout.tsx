import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";

export function AddWorkout({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}) {
  const handlePress = () => {
    openBottomSheet();
  };

  const openBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.present();
  }, []);

  return (
    <Pressable
      onPress={handlePress}
      className="bg-black/75 active:bg-black/25 transition-all items-center
   px-3 w-full 
    flex flex-row justify-between h-12 rounded-xl mt-4"
    >
      <Text className="text-white font-bold text-lg">Hareket Ekle</Text>
      <Ionicons name="add-circle-outline" size={24} color="white" />
    </Pressable>
  );
}
