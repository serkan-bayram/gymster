import { ExerciseType } from "@/utils/types/workout";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Set } from "./set";
import { cn } from "@/utils/cn";

export function Exercise({ exercise, set }: ExerciseType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Pressable
      onPress={() => setIsOpen((prevValue) => !prevValue)}
      className="  rounded-xl border
                border-white active:bg-black/75 transition-all mb-4"
    >
      <View
        className="h-10 px-3 flex flex-row items-center
               justify-between"
      >
        <Text numberOfLines={1} className="text-white max-w-[50%]">
          {exercise}
        </Text>
        <View className="flex flex-row items-center ">
          <Text className="text-white">
            {set.setCount} set {set.repeat} tekrar
          </Text>
          <View className={cn({ "rotate-180": isOpen })}>
            <MaterialIcons name="expand-more" size={24} color="white" />
          </View>
        </View>
      </View>
      {isOpen && (
        <View className="mt-3 ">
          <Set setIndex={0} weight={30} repeat={12} />
          <Set setIndex={1} weight={22} repeat={12} />
        </View>
      )}
    </Pressable>
  );
}
