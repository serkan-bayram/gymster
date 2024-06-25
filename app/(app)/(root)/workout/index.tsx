import { Heading } from "@/components/heading";
import { BackHandler, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { WorkoutTodayHeading } from "@/components/workout/workout-today-heading";
import { WorkoutTodayExercises } from "@/components/workout/workout-today-exercises";
import { AddWorkout } from "@/components/workout/add-workout";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject, useEffect, useRef } from "react";
import { WorkoutBottomSheet } from "@/components/workout/workout-bottomsheet";
import {
  useGetDefaultExercises,
  useGetTodaysWorkouts,
  useGetWorkouts,
} from "@/utils/apis/workout";
import { PastWorkouts } from "@/components/workout/past-workouts";
import { FullScreenLoading } from "@/components/loading";
import { AddExtraWorkout } from "@/components/workout/add-extra-workout";

export default function Workout() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { isPending: isDefaultExercisesPending } = useGetDefaultExercises();
  const { isPending: isTodaysWorkoutsPending } = useGetTodaysWorkouts();
  const { isPending: isWorkoutsPending } = useGetWorkouts();

  if (
    isWorkoutsPending ||
    isDefaultExercisesPending ||
    isTodaysWorkoutsPending
  ) {
    return <FullScreenLoading />;
  }

  return (
    <View className="flex-1 pt-16 pb-20 px-4 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading heading={"Antrenman"} />
        <View className="p-4 w-full max-h-[384px] bg-secondary rounded-3xl mt-8">
          <WorkoutTodayHeading />

          <WorkoutTodayExercises />

          <AddWorkout bottomSheetRef={bottomSheetRef} />
        </View>

        <AddExtraWorkout />

        <View className="p-4 px-0 ">
          <PastWorkouts />
        </View>
      </ScrollView>

      <WorkoutBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
