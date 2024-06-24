import { Text, View } from "react-native";
import { ExercisePicker } from "./exercise-picker";
import { ExerciseWeight } from "./exercise-weight";
import { ExerciseRepeat } from "./exercise-repeat";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { RefObject, useEffect, useState } from "react";
import {
  resetAddingWorkout,
  setAddingWorkout,
} from "@/utils/state/workout/workoutSlice";
import { useSaveWorkout } from "@/utils/apis/workout";
import { PrimaryButton } from "../primary-button";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ExerciseComment } from "./exercise-comment";
import { setNotification } from "@/utils/state/notification/notificationSlice";
import {
  validateComment,
  validateRepeat,
  validateWeight,
} from "@/utils/validations/workout";

export function WorkoutBottomSheetInputs({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { addingWorkout, defaultExercises } = useSelector(
    (state: RootState) => state.workout
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

  // TODO: We might move these validations to slices directly
  const handleSave = () => {
    const { comment, repeat, weight, exercise } = addingWorkout;

    // comment can be null
    if (!repeat || !weight || !exercise) {
      dispatch(
        setNotification({
          show: true,
          text: {
            heading: "Hata!",
            content:
              "Lütfen şu alanların hepsini doldurunuz: Hareket, Ağırlık, Tekrar",
          },
          type: "error",
        })
      );
      return null;
    }

    const validatedWeight = validateWeight(weight);
    const validatedRepeat = validateRepeat(repeat);
    const validatedComment = validateComment(comment ? comment : "");
    if (
      validatedWeight === false ||
      validatedRepeat === false ||
      validatedComment === false
    ) {
      return null;
    }

    dispatch(setAddingWorkout({ type: "comment", comment: validatedComment }));
    dispatch(setAddingWorkout({ type: "repeat", comment: validatedRepeat }));
    dispatch(setAddingWorkout({ type: "weight", comment: validatedWeight }));

    setIsLoading(true);
    saveWorkout.mutate();
  };

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
          onPress={handleSave}
          text="Kaydet"
          className="flex-1"
        />
      </View>
    </>
  );
}
