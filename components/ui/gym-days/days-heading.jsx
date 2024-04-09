import { Pressable, Text, View } from "react-native";
import { PlusSvg, TickSvg } from "../svg";
import { useState } from "react";
import { cn } from "@/utils/cn";

export function DaysHeading({ wentToGYM, setWentToGYM }) {
  const handleWentToGYM = () => {
    setWentToGYM(!wentToGYM);
  };

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
