import { Alert, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RunRow } from "./runs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";
import { queryGetRuns } from "@/utils/query-functions";
import { FlashList } from "@shopify/flash-list";
import * as Crypto from "expo-crypto";
import { TopStats } from "./top-stats";
import { Run, RunsDB } from "@/utils/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useUpdateRuns, useGetRuns } from "@/utils/apis/runs";

export function PastRuns() {
  const updateRuns = useUpdateRuns();
  const getRuns = useGetRuns();

  if (getRuns.isPending) {
    return (
      <View className="w-full h-full items-center mt-4">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  // When user long press a RunRow
  const handleLongPress = (item: RunsDB, runObject: Run) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const { averageSpeed, distance, runTime } = runObject;

    const runTimeAsText = `${runTime.hours} s ${runTime.minutes} dk ${runTime.seconds} sn`;

    Alert.alert(
      `Koşuyu Sil | ${item.dateAsText}`,
      `Bu koşuyu silmek istediğine emin misin?\n\nOrtalama Hız: ${averageSpeed} \nMesafe: ${distance} \nSüre: ${runTimeAsText}`,
      [
        {
          text: "Vazgeç",
        },
        {
          text: "Koşuyu Sil",
          onPress: () => {
            // We filter out the run that user wants to delete
            const newRuns = item.runs.filter(
              (run) => run.identifier !== runObject.identifier
            );

            updateRuns.mutate({
              documentPath: item.documentPath,
              newRuns: newRuns,
            });
          },
        },
      ]
    );
  };

  return (
    <>
      {getRuns.data && <TopStats data={getRuns.data} />}

      <View className="mt-4">
        <Text className="font-bold text-xl">Geçmiş Koşular</Text>
        {getRuns.data ? (
          <View className="mt-3 min-h-full  pb-48">
            <FlashList
              estimatedItemSize={190}
              data={getRuns.data}
              renderItem={({ item }) => {
                return (
                  <View className="mb-4">
                    <View className="flex flex-row items-center">
                      <Feather name="calendar" size={20} color="black" />
                      <Text className="ml-1 font-semibold text-lg">
                        {item.dateAsText}
                      </Text>
                    </View>
                    <View className="mt-1">
                      {item.runs.map((runObject) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onLongPress={() => handleLongPress(item, runObject)}
                            key={Crypto.randomUUID()}
                            className="my-2"
                          >
                            <RunRow run={runObject} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View className="w-full items-center mt-4">
            <Text>Henüz bir koşu kaydetmediniz.</Text>
          </View>
        )}
      </View>
    </>
  );
}
