import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { CounterType } from "./counter-type";

import * as Crypto from "expo-crypto";
import { Divider } from "../ui/divider";
import { memo } from "react";
import { selectRuns } from "@/utils/state/running/runningSlice";
import Animated, { FadeInUp } from "react-native-reanimated";

export const Runs = memo(() => {
  const runs = useSelector(selectRuns);

  return (
    runs.length > 0 && (
      <>
        <Divider type="horizontal" dividerClassName="my-4" />

        <View className="flex gap-y-5">
          {runs.map((run, index) => {
            const isLast = index + 1 === runs.length;

            return (
              <Animated.View
                entering={isLast ? FadeInUp : undefined}
                key={Crypto.randomUUID()}
              >
                <Text className="text-lg font-semibold">{index + 1}. Tur</Text>

                <View className="flex flex-row items-center ">
                  <View className="flex flex-row">
                    <CounterType
                      readOnly={true}
                      count={run.runTime.hours}
                      type="s"
                    />
                    <CounterType
                      readOnly={true}
                      count={run.runTime.minutes}
                      type="dk"
                    />
                    <CounterType
                      readOnly={true}
                      count={run.runTime.seconds}
                      type="sn"
                    />
                  </View>

                  <Divider type="vertical" />

                  <View className="flex flex-row mx-3">
                    <Text className="text-xl font-bold">
                      {run.averageSpeed.toFixed(1)}{" "}
                    </Text>
                    <Text className="text-lg">km/dk</Text>
                  </View>

                  <Divider type="vertical" />

                  <View className="flex flex-row mx-3">
                    <Text className="text-xl font-bold">
                      {run.distance.toFixed(1)}{" "}
                    </Text>
                    <Text className="text-lg">m</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </>
    )
  );
});
