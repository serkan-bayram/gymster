import { Alert, View } from "react-native";
import { PrimaryButton } from "../primary-button";
import { useDispatch } from "react-redux";
import { discardRun, stopRunning } from "@/utils/state/running/runningSlice";
import { AppDispatch } from "@/utils/state/store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export function RunningButtons({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const handleDiscard = () => {
    Alert.alert(
      "Vazgeç",
      "Vazgeçerseniz mevcut koşu verileriniz silinecektir, emin misiniz?",
      [
        {
          text: "Verileri Sil",
          onPress: () => {
            // Stop tracking location
            dispatch(stopRunning());

            // Set everything to initialData
            dispatch(discardRun());

            bottomSheetRef?.current?.close();
          },
        },
        {
          text: "Koşuya Devam",
        },
      ]
    );
  };

  return (
    <View className="flex flex-row gap-x-4 px-6 pb-6 mt-auto">
      <PrimaryButton onPress={handleDiscard} type="outlined" text="Vazgeç" />
      <PrimaryButton text="Kaydet" className="flex-1" />
    </View>
  );
}
