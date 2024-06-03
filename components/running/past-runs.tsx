import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RunRow } from "./runs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";

import * as Crypto from "expo-crypto";
import { queryGetRuns } from "@/utils/query-functions";

export function PastRuns() {
  const { session } = useSession();

  const query = useQuery({
    queryKey: ["runs"],
    queryFn: async () => await queryGetRuns(session?.uid),
  });

  if (query.isPending) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <View className="mt-4">
      <Text className="font-bold text-xl">Geçmiş Koşular</Text>
      <View className="mt-3 ">
        {query.data ? (
          query.data.map((run) => {
            return (
              <View key={Crypto.randomUUID()}>
                <View className="flex flex-row items-center">
                  <Feather name="calendar" size={20} color="black" />
                  <Text className="ml-1 font-semibold text-lg">
                    {run.dateAsText}
                  </Text>
                </View>
                <View className="mt-1">
                  {run.runs.map((runObject) => {
                    return <RunRow run={runObject} />;
                  })}
                </View>
              </View>
            );
          })
        ) : (
          <View className="w-full items-center mt-2">
            <Text>Henüz bir koşu kaydetmediniz.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
