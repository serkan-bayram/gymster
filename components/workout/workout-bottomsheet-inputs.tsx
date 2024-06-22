import { Text, View } from "react-native";
import { ExercisePicker } from "./exercise-picker";
import { ExerciseWeight } from "./exercise-weight";
import { ExerciseRepeat } from "./exercise-repeat";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { RefObject, useEffect, useState } from "react";
import { resetAddingWorkout } from "@/utils/state/workout/workoutSlice";
import { useSaveWorkout } from "@/utils/apis/workout";
import { PrimaryButton } from "../primary-button";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ExerciseComment } from "./exercise-comment";
import { setNotification } from "@/utils/state/notification/notificationSlice";

// TODO: We need to validate input
export function WorkoutBottomSheetInputs({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const defaultExercises = useSelector(
    (state: RootState) => state.workout.defaultExercises
  );

  const [isLoading, setIsLoading] = useState(false);

  const saveWorkout = useSaveWorkout();

  const isSaved = saveWorkout.data;

  useEffect(() => {
    if (isSaved) {
      bottomSheetRef?.current?.dismiss();

      dispatch(
        setNotification({
          show: true,
          text: {
            heading: "Tebrikler",
            content: "Hareketiniz başarıyla kaydedildi.",
          },
          type: "success",
        })
      );
    }

    setIsLoading(false);
  }, [isSaved]);

  // Reset state when bottomsheet reopens
  useEffect(() => {
    dispatch(resetAddingWorkout());
  }, []);

  return (
    <>
      <View className="mt-16">
        <Text className="font-bold text-xl">Hareket Ekle</Text>
      </View>

      <View className="mt-4">
        <Text className="text-lg">Hareketi Seç</Text>
        <ExercisePicker
          defaultExercises={
            defaultExercises ? defaultExercises : { exercises: [] }
          }
        />
      </View>

      <View className="mt-4">
        <Text className="text-lg">Ağırlık</Text>
        <ExerciseWeight />
      </View>

      <View className="mt-4">
        <Text className="text-lg">Tekrar</Text>
        <ExerciseRepeat />
      </View>

      <View className="mt-4 mb-4">
        <Text className="text-lg">Yorum</Text>
        <ExerciseComment />
      </View>

      <View className="flex flex-row gap-x-3 mt-auto pb-6">
        <PrimaryButton
          onPress={() => bottomSheetRef?.current?.dismiss()}
          type="outlined"
          text="Vazgeç"
        />
        <PrimaryButton
          isLoading={isLoading}
          onPress={() => {
            setIsLoading(true);
            saveWorkout.mutate();
          }}
          text="Kaydet"
          className="flex-1"
        />
      </View>
    </>
  );
}
