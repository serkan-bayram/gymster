import { Heading } from "@/components/heading";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { getServerTime } from "@/utils/db";
import { FullScreenLoading } from "@/components/loading";
import { Stats } from "./components/stats";

// Get's the current month
function useCurrentMonth() {
  return useQuery({
    queryKey: ["getCurrentMonth"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      if (serverTime) {
        const date = new Date(serverTime.date.toDate());

        const month = date.toLocaleDateString("tr-TR", { month: "long" });

        return month;
      }

      return null;
    },
  });
}

export interface Data {
  label: string;
  value: number;
}

export default function Stat() {
  const currentMonth = useCurrentMonth();

  if (currentMonth.isPending) {
    return <FullScreenLoading />;
  }

  return (
    <ScrollView className="pt-16 pb-20 px-4 bg-background flex-1 ">
      <Heading heading="Koşu İstatisikleri" />
      <Stats currentMonth={currentMonth.data || "Ocak"} />
    </ScrollView>
  );
}
