import { cn } from "@/utils/cn";
import { queryGetGYMCalendar } from "@/utils/query-functions";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

// TODO: Calculations on this component are very expensive find a way to fix it
export function DaysContainer({ wentToGYMDays }) {
  // This query returns the calendar of current month
  const query = useQuery({
    queryKey: ["GYMCalendar"],
    queryFn: async () => await queryGetGYMCalendar(),
  });

  return (
    <View
      className="w-full h-48 border-2 
 border-secondary bg-primary rounded-2xl p-2 overflow-hidden"
    >
      <View className="flex gap-y-2 mb-2">
        <Text className="font-bold">{query.data?.monthName}</Text>

        <View className="flex flex-row flex-wrap gap-1">
          {Array.from({ length: query.data?.daysCount }).map((_, index) => {
            return (
              <View
                key={index}
                className={cn(
                  `w-8 h-8 flex items-center justify-center
                      bg-black rounded-full`,
                  {
                    "bg-green-600": wentToGYMDays.includes(index + 1),
                  }
                )}
              >
                <Text className="text-background">{index + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
