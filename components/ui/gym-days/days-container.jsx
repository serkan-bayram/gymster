import { cn } from "@/utils/cn";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

// TODO: Calculations on this component are very expensive find a way to fix it
export function DaysContainer({ wentToGYM }) {
  const date = new Date();

  const year = date.getFullYear();

  // This will come from DB problably
  const months = [
    { month: "January", countOfDays: 31 },
    { month: "February", countOfDays: 28 }, // Assuming non-leap year
    { month: "March", countOfDays: 31 },
    { month: "April", countOfDays: 30 },
    { month: "May", countOfDays: 31 },
    { month: "June", countOfDays: 30 },
    { month: "July", countOfDays: 31 },
    { month: "August", countOfDays: 31 },
    { month: "September", countOfDays: 30 },
    { month: "October", countOfDays: 31 },
    { month: "November", countOfDays: 30 },
    { month: "December", countOfDays: 31 },
  ];

  const todaysDay = date.getDate();
  const todaysMonth = date.getMonth(); // months stored as index
  const todaysDate = `${todaysDay}-${todaysMonth + 1}-${year}`;

  const daysWentToGYM = [
    "22-4-2024",
    "23-4-2024",
    "24-4-2024",
    "25-4-2024",
    wentToGYM && todaysDate,
  ];

  return (
    <View
      className="w-full h-48 border-2 
 border-secondary bg-[#FBF3D5] rounded-2xl p-2 overflow-hidden"
    >
      <Text className="absolute top-2 right-2">{year}</Text>

      <FlashList
        initialScrollIndex={todaysMonth}
        data={months}
        estimatedItemSize={176}
        renderItem={({ item, index: monthIndex }) => {
          return (
            <View className="flex gap-y-2 mb-2">
              <Text className="font-bold">{item.month}</Text>

              <View className="flex flex-row flex-wrap gap-1">
                {Array.from({ length: item.countOfDays }).map((_, index) => {
                  const date = `${index + 1}-${monthIndex + 1}-${year}`;

                  return (
                    <View
                      key={index}
                      className={cn(
                        `w-8 h-8 flex items-center justify-center
                      bg-secondary rounded-full`,
                        { "bg-green-600": daysWentToGYM.includes(date) }
                      )}
                    >
                      <Text className=" text-background">{index + 1}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
