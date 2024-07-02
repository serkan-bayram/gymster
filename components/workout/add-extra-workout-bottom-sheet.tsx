import {
  getBackdrop,
  getSnapPoints,
  useCloseBottomSheetOnBackPressed,
} from "@/utils/bottomsheet";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { PrimaryButton } from "../primary-button";
import {
  useDeleteExtraExercise,
  useSaveExtraExercise,
} from "@/utils/apis/workout";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import * as Crypto from "expo-crypto";
import { ExtraWorkout } from "@/utils/types/workout";

function ExtraWorkouts() {
  const extraWorkouts = useSelector(
    (state: RootState) => state.workout.extraWorkouts
  );

  const mutation = useDeleteExtraExercise();

  const handlePress = (extraExercise: ExtraWorkout) => {
    mutation.mutate(extraExercise);
  };

  return !!extraWorkouts && extraWorkouts.length > 0 ? (
    <View className="mt-2">
      <Text className="font-bold text-lg">Hareketler</Text>
      <View className="flex flex-row flex-wrap gap-2 gap-x-4 mt-2 mb-4 ">
        {extraWorkouts.map((extraWorkout) => {
          return (
            <Pressable
              onLongPress={() => handlePress(extraWorkout)}
              key={Crypto.randomUUID()}
              className="p-2 rounded-lg px-4
                bg-gray/25 border-gray border-2"
            >
              <Text>{extraWorkout.name}</Text>
            </Pressable>
          );
        })}
      </View>
      <View className="mb-4 mt-12 flex w-full items-center ">
        <Text className="text-black/50">Hareketi silmek için basılı tut.</Text>
      </View>
    </View>
  ) : (
    <View className="flex mt-8 items-center">
      <Text>Henüz ekstra hareket eklemediniz.</Text>
    </View>
  );
}

export function AddExtraWorkoutBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints(["80%"]);
  const renderBackdrop = getBackdrop();
  const setIndex = useCloseBottomSheetOnBackPressed(bottomSheetRef);
  const [isLoading, setIsLoading] = useState<boolean>();

  const [input, setInput] = useState<string>("");

  const inputRef = useRef<TextInput | null>(null);

  const mutation = useSaveExtraExercise();

  useEffect(() => {
    if (mutation.isSuccess) {
      setIsLoading(false);
    }
  }, [mutation]);

  const handleSave = async () => {
    setIsLoading(true);
    mutation.mutate(input);
    inputRef?.current?.clear();
  };

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      onChange={(index) => {
        setIndex(index);
      }}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-4 ">
          <View
            className="w-full border border-t-0 border-x-0 border-b-gray pb-2
            mt-8"
          >
            <Text className="text-xs">
              * Bu menüyü kullanarak özel hareket isimleri ekleyebilir, daha
              sonra antrenman sırasında bu hareketleri seçebilirsiniz.
            </Text>
          </View>

          <View className="flex flex-row h-10 items-center mt-4 justify-between">
            <View className="w-[75%] h-10 bg-gray rounded-lg">
              <TextInput
                ref={inputRef}
                onChangeText={setInput}
                placeholder="Hareket adı"
                className="p-1 px-2"
              />
            </View>
            <PrimaryButton
              isLoading={isLoading}
              onPress={handleSave}
              text="Kaydet"
              className="h-10 p-2 rounded-lg"
            />
          </View>

          <ExtraWorkouts />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
