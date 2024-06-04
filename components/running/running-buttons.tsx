import { Alert, View } from "react-native";
import { PrimaryButton } from "../primary-button";
import { useDispatch, useSelector } from "react-redux";
import { discardRun, stopRunning } from "@/utils/state/running/runningSlice";
import { AppDispatch, RootState } from "@/utils/state/store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RunsDB } from "@/utils/types";
import { getServerTime, saveRun } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import * as Crypto from "expo-crypto";

export function RunningButtons({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const running = useSelector((state: RootState) => state.running);
  const { session } = useSession();

  const stopEverything = () => {
    // Stop tracking location
    dispatch(stopRunning());

    // Set everything to initialData
    dispatch(discardRun());

    bottomSheetRef?.current?.close();
  };

  const handleDiscard = () => {
    Alert.alert(
      "Vazgeç",
      "Vazgeçerseniz mevcut koşu verileriniz silinecektir, emin misiniz?",
      [
        {
          text: "Verileri Sil",
          onPress: stopEverything,
        },
        {
          text: "Koşuya Devam",
        },
      ]
    );
  };

  const queryClient = useQueryClient();

  // Save run to DB
  const mutation = useMutation({
    mutationKey: ["saveRun"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getRuns"],
      });
    },
    mutationFn: async ({ runData }: { runData: RunsDB }) =>
      await saveRun(runData),
  });

  // Save to DB
  const handleSave = async () => {
    if (running.isRunning) {
      Alert.alert(
        "Dikkat!",
        "Koşuyu kaydetmek için öncelikle mevcut koşunuzu durdurunuz.",
        [{ text: "Tamam" }]
      );
      return;
    }

    if (running.runs.length === 0) {
      stopEverything();
      return;
    }

    const serverTime = await getServerTime();

    if (serverTime && session) {
      const createdAt = serverTime.date;
      const uid = session.uid;
      const runs = running.runs;

      const runsWithIdentifier = runs.map((run) => ({
        ...run,
        identifier: Crypto.randomUUID(),
      }));

      const saveObject: RunsDB = {
        createdAt: createdAt,
        uid: uid,
        runs: runsWithIdentifier,
      };

      mutation.mutate({ runData: saveObject });

      stopEverything();
    }
  };

  return (
    <View className="flex flex-row gap-x-4 px-6 pb-6 mt-auto">
      <PrimaryButton onPress={handleDiscard} type="outlined" text="Vazgeç" />
      <PrimaryButton
        onPress={handleSave}
        text="Koşuyu Kaydet"
        className="flex-1"
      />
    </View>
  );
}
