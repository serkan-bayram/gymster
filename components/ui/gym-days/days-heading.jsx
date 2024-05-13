import { Pressable, Text, View } from "react-native";
import { PlusSvg, TickSvg } from "../svg";
import { cn } from "@/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { findTrackingsDoc, getServerTime, updateWentToGYM } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { useTime } from "@/utils/time-context";

export function DaysHeading({ wentToGYM, setWentToGYM, setWentToGYMDays }) {
  // We can use the serverTime that already loaded for optimistic updates
  // But we don't use it for the real mutation for security purposes
  const { serverTime } = useTime();

  const handleWentToGYM = () => {
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

    mutation.mutate({ wentToGYM: !wentToGYM });

    setWentToGYM(!wentToGYM);
  };

  const { session } = useSession();

  // This mutation updates the wentToGYM field of related document
  // TODO: Add optimistic updates
  const mutation = useMutation({
    mutationKey: ["updateWentToGYM"],
    mutationFn: async ({ wentToGYM }) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        const { trackingsPath } = foundTrackingsDoc;

        await updateWentToGYM(trackingsPath, wentToGYM);
      }
    },
  });

  return (
    <View className="flex flex-row mb-2 justify-between items-center">
      <Text className="text-lg">Streak</Text>
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
          Went to GYM
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
