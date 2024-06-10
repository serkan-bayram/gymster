import { Heading } from "@/components/heading";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { WorkoutTodayHeading } from "@/components/workout/workout-today-heading";
import { WorkoutTodayExercises } from "@/components/workout/workout-today-exercises";
import { AddWorkout } from "@/components/workout/add-workout";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { ExercisePicker } from "@/components/workout/exercise-picker";

export default function Workout() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // TODO: We can move these bottom sheet properties to one file
  const snapPoints = useMemo(() => ["70%"], []);
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"none"}
        style={[
          { backgroundColor: "rgba(0, 0, 0, 1)" },
          StyleSheet.absoluteFillObject,
        ]}
      />
    ),
    []
  );

  return (
    <View className="flex-1 pt-16 pb-20 px-4 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading heading={"Antrenman"} />
        <View className="p-4 w-full h-96 bg-secondary rounded-3xl mt-8">
          <WorkoutTodayHeading />

          <WorkoutTodayExercises />

          <AddWorkout bottomSheetRef={bottomSheetRef} />
        </View>
      </ScrollView>

      <BottomSheetModal
        backdropComponent={renderBackdrop}
        handleStyle={{ display: "none" }}
        enablePanDownToClose={false}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="flex-1 px-4">
            <View className="mt-8">
              <Text className="font-bold text-xl">Hareket Ekle</Text>
            </View>

            <ExercisePicker />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
