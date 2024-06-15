import { Pressable, Text, View } from "react-native";
import { PlusSvg, TickSvg } from "../svg";
import { cn } from "@/utils/cn";
import { getServerTime } from "@/utils/db";
import { useUpdateWentToGYM } from "@/utils/apis/gymDays";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import {
  setWentToGYM,
  setWentToGYMDays,
} from "@/utils/state/gymDays/gymDaysSlice";

export function DaysHeading() {
  const wentToGYM = useSelector((state: RootState) => state.gymDays.wentToGYM);
  const dispatch = useDispatch<AppDispatch>();

  const updateWentToGYM = useUpdateWentToGYM();

  const handleWentToGYM = async () => {
    const serverTime = await getServerTime();

    if (!serverTime) return null;

    const serverDate = new Date(serverTime.date.toDate());
    const todaysDate = serverDate.getDate();

    dispatch(setWentToGYMDays(todaysDate));
    dispatch(setWentToGYM(!wentToGYM));

    updateWentToGYM.mutate({ wentToGYM: !wentToGYM });
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
