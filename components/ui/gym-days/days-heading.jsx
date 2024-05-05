import { Pressable, Text, View } from "react-native";
import { PlusSvg, TickSvg } from "../svg";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findTrackingsDoc, getServerTime, updateGYMDays } from "@/utils/db";
import { useSession } from "@/utils/session-context";

export function DaysHeading({ wentToGYM, setWentToGYM }) {
  const queryClient = useQueryClient();

  const handleWentToGYM = () => {
    mutation.mutate({ wentToGYM: !wentToGYM });

    setWentToGYM(!wentToGYM);
  };

  const { session } = useSession();

  // This mutation updates the wentToGYM field of related document
  // TODO: Add optimistic updates
  const mutation = useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wentToGYMDays"] });
    },
    mutationFn: async ({ wentToGYM }) => {
      await queryClient.cancelQueries({ queryKey: ["wentToGYMDays"] });

      // Upddate & get server time
      const { serverTime } = await getServerTime();

      if (serverTime) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        const { trackingsPath } = foundTrackingsDoc;

        const isUpdated = await updateGYMDays(trackingsPath, wentToGYM);
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
