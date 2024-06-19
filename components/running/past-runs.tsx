import { Alert, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RunRow } from "./runs";
import { FlashList } from "@shopify/flash-list";
import * as Crypto from "expo-crypto";
import { TopStats } from "./top-stats";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useUpdateRuns } from "@/utils/apis/runs";
import { Run, RunsDB } from "@/utils/types/runs";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";
import { setNotification } from "@/utils/state/notification/notificationSlice";

export function PastRuns({
  getRunsData,
}: {
  getRunsData: RunsDB[] | null | undefined;
}) {
  const updateRuns = useUpdateRuns();
  const dispatch = useDispatch<AppDispatch>();

  // When user long press a RunRow
  const handleLongPress = (item: RunsDB, runObject: Run) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const { averageSpeed, distance, runTime } = runObject;

    const runTimeAsText = `${runTime.hours} s ${runTime.minutes} dk ${runTime.seconds} sn`;

    Alert.alert(
      `Koşuyu Sil | ${item.dateAsText}`,
      `Bu koşuyu silmek istediğine emin misin?\n\nOrtalama Hız: ${averageSpeed.toFixed(
        2
      )} km/dk \nMesafe: ${distance.toFixed(2)} km \nSüre: ${runTimeAsText}`,
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

            if (item.documentPath) {
              updateRuns.mutate({
                documentPath: item.documentPath,
                newRuns: newRuns,
              });

              dispatch(
                setNotification({
                  show: true,
                  text: {
                    heading: "Başarılı",
                    content: "Koşunuz silindi.",
                  },
                  type: "success",
                })
              );
            }
          },
        },
      ]
    );
  };

  //TODO: Should specify the year
  return (
    <>
      {getRunsData && <TopStats data={getRunsData} />}

      <View className="mt-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="font-bold text-xl">Geçmiş Koşular</Text>
          <Text className="text-xs">Silmek için basılı tutun.</Text>
        </View>
        {getRunsData ? (
          <>
            <View className="mt-3 min-h-full pb-48 ">
              <FlashList
                estimatedItemSize={190}
                data={getRunsData}
                renderItem={({ item, index }) => {
                  if (item.runs.length === 0) return <View></View>;

                  return (
                    <Animated.View
                      entering={FadeIn.delay(index * 120)}
                      className="mb-4"
                    >
                      <View className="flex flex-row items-center">
                        <Feather name="calendar" size={20} color="black" />
                        <Text className="ml-1 font-semibold text-lg">
                          {item.dateAsText}
                        </Text>
                      </View>
                      <View className="mt-1">
                        {item.runs.map((runObject: Run) => {
                          return (
                            <TouchableOpacity
                              activeOpacity={0.5}
                              onLongPress={() =>
                                handleLongPress(item, runObject)
                              }
                              key={Crypto.randomUUID()}
                              className="my-2"
                            >
                              <RunRow run={runObject} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </Animated.View>
                  );
                }}
              />
            </View>
          </>
        ) : (
          <View className="w-full items-center mt-4">
            <Text className="text-black/50">Henüz bir koşu kaydetmediniz.</Text>
          </View>
        )}
      </View>
    </>
  );
}
