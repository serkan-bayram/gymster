import { useGetGYMCalendar, useGetWentToGYMDays } from "@/utils/apis/gymDays";
import { cn } from "@/utils/cn";
import { RootState } from "@/utils/state/store";
import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

const Days = memo(({ daysCount }: { daysCount: number | undefined }) => {
  const wentToGYMDays = useSelector(
    (state: RootState) => state.gymDays.wentToGYMDays
  );

  const dayElements = useMemo(() => {
    return Array.from({ length: daysCount || 30 }).map((_, index) => (
      <View
        key={index}
        className={cn(
          "w-8 h-8 m-[2px] flex items-center justify-center bg-black rounded-full transition-all",
          {
            "bg-green-600": wentToGYMDays.includes(index + 1),
          }
        )}
      >
        <Text className="text-background">{index + 1}</Text>
      </View>
    ));
  }, [wentToGYMDays]);

  return dayElements;
});

export function DaysContainer() {
  const GYMCalendar = useGetGYMCalendar();

  useGetWentToGYMDays();

  return (
    <View
      className="w-full h-48 border-2 
 border-secondary bg-primary rounded-2xl p-2 overflow-hidden"
    >
      <View className="flex gap-y-2 mb-2">
        <Text className="font-bold">{GYMCalendar.data?.monthName}</Text>

        <View className="flex flex-row flex-wrap ">
          <Days daysCount={GYMCalendar.data?.daysCount} />
        </View>
      </View>
    </View>
  );
}
