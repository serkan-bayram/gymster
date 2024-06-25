import {
  getBackdrop,
  getSnapPoints,
  useCloseBottomSheetOnBackPressed,
} from "@/utils/bottomsheet";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { RefObject } from "react";
import { Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

interface ExtraWorkout {
  id: string;
  name: string;
}

const useGetUserExtraWorkouts = () => {
  const { user } = useSelector((state: RootState) => state.session);

  const queryFn = async () => {
    if (!user) return null;

    const defaultExercisesRef = firestore().collection("DefaultExercises");

    const usersDocument = await defaultExercisesRef
      .where("uid", "==", user.uid)
      .limit(1)
      .get();

    if (usersDocument.empty) return null;

    const usersDocumentPath = usersDocument.docs[0].ref.path;

    const usersExercisesRef = firestore().collection(
      `${usersDocumentPath}/exercises`
    );

    const usersExercises = await usersExercisesRef.get();

    if (usersExercises.empty) return null;

    const extraWorkouts: ExtraWorkout[] = [];

    usersExercises.forEach((usersExercise) => {
      const data = usersExercise.data() as ExtraWorkout;

      extraWorkouts.push(data);
    });

    return extraWorkouts;
  };

  return useQuery({ queryKey: ["getUserExtraWorkouts"], queryFn: queryFn });
};

export function AddExtraWorkoutBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints(["50%"]);
  const renderBackdrop = getBackdrop();
  const setIndex = useCloseBottomSheetOnBackPressed(bottomSheetRef);

  const { data: extraWorkouts } = useGetUserExtraWorkouts();

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      onChange={(index) => {
        setIndex(index);
      }}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-4 ">
          <View className="w-full p-2 border-2 border-secondary bg-[#B0EBB4]/30 rounded-xl mt-4">
            <Text>
              Bu menüyü kullanarak özel hareket isimleri ekleyebilir, daha sonra
              antrenman sırasında bu hareketleri seçebilirsiniz.
            </Text>
          </View>

          {!!extraWorkouts && extraWorkouts.length > 0 ? (
            <View></View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text>Henüz ekstra hareket eklemediniz.</Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
