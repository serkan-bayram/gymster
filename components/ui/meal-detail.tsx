import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Meal, Nutritions } from "../meals";
import * as Crypto from "expo-crypto";
import { cn } from "@/utils/cn";
import { AntDesign } from "@expo/vector-icons";
import { Image, ImageSource } from "expo-image";

function Nutrition({
  value,
  type,
  isLast,
  iconSrc,
}: {
  value: string;
  type: string;
  isLast?: boolean;
  iconSrc: ImageSource;
}) {
  return (
    <View className="flex flex-row ">
      <View className={cn({ "mr-4": !isLast })}>
        <View className="flex flex-row items-center ">
          <View className="w-5 h-5 mr-1">
            <Image className="flex-1" contentFit="contain" source={iconSrc} />
          </View>
          <Text className={cn(" text-center font-bold text-lg text-secondary")}>
            {value}
          </Text>
        </View>
        <Text className={cn("text-center text-secondary")}>{type}</Text>
      </View>
      {!isLast && <View className="mr-4 h-full w-[1px] bg-gray"></View>}
    </View>
  );
}

export function MealDetail({ detail }: { detail: Meal }) {
  const { userInput, nutritions } = detail;

  return (
    <View className="w-full p-2 border rounded-xl my-2 border-gray ">
      <View className="flex flex-row justify-between items-center">
        <Text
          numberOfLines={1}
          className={cn("text-secondary  text-lg w-[90%]")}
        >
          {userInput}
        </Text>
      </View>
      <View className="flex flex-row mt-4 justify-evenly">
        {nutritions &&
          (Object.keys(nutritions) as (keyof Nutritions)[]).map(
            (nutrition, index) => {
              const isLast =
                index + 1 === Object.keys(nutritions).length ? true : false;

              let iconSrc;

              switch (nutrition) {
                case "carbs":
                  iconSrc = require("@/assets/nutritions/starch.png");
                  break;
                case "protein":
                  iconSrc = require("@/assets/nutritions/proteins.png");
                  break;
                case "fat":
                  iconSrc = require("@/assets/nutritions/trans-fats-free.png");
                  break;
                case "kcal":
                  iconSrc = require("@/assets/nutritions/fire.png");
                  break;
                default:
                  iconSrc = require("@/assets/nutritions/fire.png");
                  break;
              }

              return (
                <Nutrition
                  iconSrc={iconSrc}
                  key={Crypto.randomUUID()}
                  type={nutrition}
                  value={nutritions[nutrition]}
                  isLast={isLast}
                />
              );
            }
          )}
      </View>
    </View>
  );
}
