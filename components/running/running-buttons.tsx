import { Alert, View } from "react-native";
import { PrimaryButton } from "../primary-button";
import { useDispatch, useSelector } from "react-redux";
import { discardRun, stopRunning } from "@/utils/state/running/runningSlice";
import { AppDispatch, RootState } from "@/utils/state/store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getServerTime } from "@/utils/db";
import * as Crypto from "expo-crypto";
import { useAddRuns } from "@/utils/apis/runs";
import { RunsDB } from "@/utils/types/runs";
import { setNotification } from "@/utils/state/notification/notificationSlice";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";

export function RunningButtons({
  handleDiscard,
  stopEverything,
}: {
  handleDiscard: () => void;
  stopEverything: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const running = useSelector((state: RootState) => state.running);
  const user = useSelector((state: RootState) => state.session.user);
  const [isLoading, setIsLoading] = useState(false);

  const addRuns = useAddRuns();

  // Save to DB
  const handleSave = async () => {
    if (running.isRunning) {
      dispatch(
        setNotification({
          show: true,
          type: "error",
          text: {
            heading: "Dikkat!",
            content:
              "Koşuyu kaydetmek için öncelikle mevcut koşunuzu durdurunuz.",
          },
        })
      );
      return;
    }

    if (running.runs.length === 0) {
      stopEverything();
      return;
    }

    setIsLoading(true);

    const serverTime = await getServerTime();

    if (serverTime && user) {
      const uid = user.uid;
      const runs = running.runs;

      const runsWithIdentifier = runs.map((run) => ({
        ...run,
        identifier: Crypto.randomUUID(),
      }));

      const saveObject: RunsDB = {
        createdAt: firestore.FieldValue.serverTimestamp(),
        uid: uid,
        runs: runsWithIdentifier,
      };

      addRuns.mutate({ runData: saveObject });

      dispatch(
        setNotification({
          show: true,
          text: {
            heading: "Tebrikler",
            content: "Koşunuz başarıyla kaydedildi.",
          },
          type: "success",
        })
      );

      stopEverything();
    }

    setIsLoading(false);
  };

  return (
    <View className="flex flex-row gap-x-4 px-6 pb-6 mt-auto">
      <PrimaryButton onPress={handleDiscard} type="outlined" text="Vazgeç" />
      <PrimaryButton
        isLoading={isLoading}
        onPress={handleSave}
        text="Koşuyu Kaydet"
        className="flex-1"
      />
    </View>
  );
}
