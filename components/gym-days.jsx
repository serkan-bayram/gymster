import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

export function GYMDays() {
  const months = [
    // { month: "January", countOfDays: 31 },
    // { month: "February", countOfDays: 28 }, // Assuming non-leap year
    // { month: "March", countOfDays: 31 },
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

  const year = new Date().getFullYear();

  // TODO: give a better background color
  return (
    <View className="flex gap-y-2 mt-4">
      <Text className="text-lg">GYM Days</Text>
      <View
        className="w-full h-48 border-2 
     border-secondary bg-[#FBF3D5] rounded-2xl p-2 overflow-hidden"
      >
        <Text className="absolute top-2 right-2">{year}</Text>
        <FlashList
          data={months}
          estimatedItemSize={176}
          renderItem={({ item }) => (
            <View className="flex gap-y-2 mb-2">
              <Text className="font-bold">{item.month}</Text>

              <View className="flex flex-row flex-wrap gap-1">
                {Array.from({ length: item.countOfDays }).map((_, index) => (
                  <View
                    key={index}
                    className="w-8 h-8 flex items-center justify-center
           bg-secondary rounded-full"
                  >
                    <Text className=" text-background">{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
