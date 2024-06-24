import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Crypto from "expo-crypto";
import { TopStats } from "./top-stats";
import * as Haptics from "expo-haptics";
import { useUpdateRuns } from "@/utils/apis/runs";
import { Run, RunsDB } from "@/utils/types/runs";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";
import { setNotification } from "@/utils/state/notification/notificationSlice";
import { Map } from "./map";
import { Divider } from "../ui/divider";

interface Metric {
  name: string;
  metric: string;
  sideText?: string;
}

function PastRunMetric({ name, metric, sideText }: Metric) {
  return (
    <View>
      <Text className=" text-black/40">{name}</Text>
      <View className="flex flex-row items-center">
        <Text className="font-bold text-lg mr-1">{metric}</Text>
        {sideText && <Text className="text-black/40 ">km</Text>}
      </View>
    </View>
  );
}

function PastRun({ run }: { run: Run }) {
  const processedRunTime =
    run.runTime.hours <= 0
      ? `${run.runTime.minutes}dk ${run.runTime.seconds}s`
      : `${run.runTime.hours}sa ${run.runTime.minutes}`;

  const metrics: Metric[] = [
    { name: "Mesafe", metric: `${run.distance}`, sideText: "km" },
    { name: "Hız", metric: `${run.averageSpeed}`, sideText: "/km" },
    { name: "Süre", metric: processedRunTime },
  ];

  return (
    <View className="w-full gap-x-2 flex flex-row ">
      <View className="h-40 w-[70%] overflow-hidden rounded-xl ">
        {run?.locations?.length >= 2 ? (
          <Map waypoints={run.locations} />
        ) : (
          <View className="w-full h-full  flex items-center justify-center bg-gray/50">
            <Text className="text-center font-semibold">
              Harita için yeterince veri toplanamadı.
            </Text>
          </View>
        )}
      </View>
      <View className="w-[30%] h-40 flex justify-between ">
        {metrics.map((metric) => (
          <PastRunMetric
            key={Crypto.randomUUID()}
            name={metric.name}
            metric={metric.metric}
            sideText={metric?.sideText}
          />
        ))}
      </View>
    </View>
  );
}

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
                      className="mb-4  "
                    >
                      <View className="flex flex-row items-center">
                        <Feather name="calendar" size={20} color="black" />
                        <Text className="ml-1 font-semibold text-lg">
                          {item.dateAsText}
                        </Text>
                      </View>
                      <View className="pb-3">
                        {item.runs.map((runObject: Run) => {
                          return (
                            <Pressable
                              onLongPress={() =>
                                handleLongPress(item, runObject)
                              }
                              key={Crypto.randomUUID()}
                              className="my-2"
                            >
                              <PastRun run={runObject} />
                            </Pressable>
                          );
                        })}
                      </View>

                      <Divider type="horizontal" />
                      {index + 1 === getRunsData.length && (
                        <View className="w-full mt-4 items-center ">
                          <Text className="text-black/50">
                            Silmek için basılı tutun.
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  );
                }}
              />
            </View>
          </>
        ) : (
          <View className="w-full items-center mt-12">
            <Text className="text-black/50">Henüz bir koşu kaydetmediniz.</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pastRunContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
  },
});

{
  /* <View className="mt-1">
                        
                      </View> */
}
