import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RunRow } from "./runs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";

import * as Crypto from "expo-crypto";
import { queryGetRuns } from "@/utils/query-functions";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "../ui/divider";
import Animated, { FadeInUp } from "react-native-reanimated";

export function PastRuns() {
  const { session } = useSession();

  // Get runs from DB
  const query = useQuery({
    queryKey: ["getRuns"],
    queryFn: async () => await queryGetRuns(session?.uid),
  });

  if (query.isPending) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <View className="mt-4">
      <Text className="font-bold text-xl">Geçmiş Koşular</Text>
      {query.data ? (
        <View className="mt-3 pb-72">
          <FlatList
            data={query.data}
            renderItem={({ item, index }) => {
              setTimeout(() => {}, index * 600);

              return (
                <Animated.View
                  entering={FadeInUp}
                  className="mb-4"
                  key={Crypto.randomUUID()}
                >
                  <View className="flex flex-row items-center">
                    <Feather name="calendar" size={20} color="black" />
                    <Text className="ml-1 font-semibold text-lg">
                      {item.dateAsText}
                    </Text>
                  </View>
                  <View className="mt-1">
                    {item.runs.map((runObject) => {
                      return (
                        <View className="my-2">
                          <RunRow run={runObject} />
                        </View>
                      );
                    })}
                  </View>
                </Animated.View>
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
  );
}
