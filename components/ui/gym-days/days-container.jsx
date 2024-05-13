import { cn } from "@/utils/cn";
import { daysInMonth } from "@/utils/days-in-month";
import { useTime } from "@/utils/time-context";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

// TODO: Calculations on this component are very expensive find a way to fix it
export function DaysContainer({ wentToGYMDays }) {
  const { serverTime } = useTime();

  // This query returns the calendar of current month
  const query = useQuery({
    queryKey: ["GYMCalendar"],
    queryFn: async () => {
      if (serverTime) {
        const serverDate = new Date(serverTime.date.toDate());

        const daysCount = daysInMonth(
          serverDate.getMonth(),
          serverDate.getFullYear()
        );

        const todaysDate = serverDate.getDate();
        const monthName = serverDate.toLocaleString("default", {
          month: "long",
        });

        return { daysCount, todaysDate, monthName };
      }

      return null;
    },
  });

  return (
    <View
      className="w-full h-48 border-2 
 border-secondary bg-[#FBF3D5] rounded-2xl p-2 overflow-hidden"
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
                      bg-secondary rounded-full`,
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
