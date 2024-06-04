import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RunRow } from "./runs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";
import { queryGetRuns } from "@/utils/query-functions";
import { FlashList } from "@shopify/flash-list";

import * as Crypto from "expo-crypto";
import { TopStats } from "./top-stats";

export function PastRuns() {
  const { session } = useSession();

  // Get runs from DB
  const query = useQuery({
    queryKey: ["getRuns"],
    queryFn: async () => await queryGetRuns(session?.uid),
  });

  if (query.isPending) {
    return (
      <View className="w-full h-full items-center mt-4">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <>
      {query.data && <TopStats data={query.data} />}

      <View className="mt-4">
        <Text className="font-bold text-xl">Geçmiş Koşular</Text>
        {query.data ? (
          <View className="mt-3 min-h-full  pb-48">
            <FlashList
              estimatedItemSize={190}
              data={query.data}
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
                          <View key={Crypto.randomUUID()} className="my-2">
                            <RunRow run={runObject} />
                          </View>
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
