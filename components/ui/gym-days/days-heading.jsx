import { Pressable, Text, View } from "react-native";
import { PlusSvg, TickSvg } from "../svg";
import { cn } from "@/utils/cn";
import { getServerTime } from "@/utils/db";
import { useUpdateWentToGYM } from "@/utils/apis/gymDays";

export function DaysHeading({ wentToGYM, setWentToGYM, setWentToGYMDays }) {
  const updateWentToGYM = useUpdateWentToGYM();

  const handleWentToGYM = async () => {
    const serverTime = await getServerTime();

    const serverDate = new Date(serverTime.date.toDate());
    const todaysDate = serverDate.getDate();

    // Optimistic updates
    // Add todays date if not already added
    setWentToGYMDays((prevValues) => {
      if (prevValues.includes(todaysDate)) {
        const updatedDays = prevValues.filter((days) => days !== todaysDate);
        return updatedDays;
      }

      const updatedDays = [...prevValues];
      updatedDays.push(todaysDate);
      return updatedDays;
    });

    updateWentToGYM.mutate({ wentToGYM: !wentToGYM });

    setWentToGYM(!wentToGYM);
  };

  return (
    <View className="flex flex-row mb-2 justify-between items-center">
      <Text className="text-lg font-semibold">Seri</Text>
      <Pressable
        className={cn(
          `flex flex-row p-1 px-2 rounded-lg bg-white
      border items-center transition-all active:scale-105`,
          {
            "bg-green-600": wentToGYM,
          }
        )}
        onPress={handleWentToGYM}
      >
        <Text
          className={cn(`text-black`, {
            "text-white": wentToGYM,
          })}
        >
          Egzersiz Yaptım
        </Text>
        {wentToGYM ? (
          <View className="rotate-45">
            <PlusSvg width={15} height={15} fill={"white"} />
          </View>
        ) : (
          <TickSvg width={15} height={15} fill={"black"} />
        )}
      </Pressable>
    </View>
  );
}
