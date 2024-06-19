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
import { setRenderConfetti } from "@/utils/state/confetti/confettiSlice";
import { useSound } from "@/utils/use-sound";

export function DaysHeading() {
  const wentToGYM = useSelector((state: RootState) => state.gymDays.wentToGYM);
  const dispatch = useDispatch<AppDispatch>();

  const updateWentToGYM = useUpdateWentToGYM();

  const playSound = useSound({
    source: require("@/assets/sounds/confirm.mp3"),
  });

  // wenToGYM updates when dispatch happens
  // So we run this function with the wentToGYM value that
  // actually correct
  const handleWentToGYM = async (currentWentToGYM: boolean) => {
    const serverTime = await getServerTime();

    if (!serverTime) return null;

    const serverDate = new Date(serverTime.date.toDate());
    const todaysDate = serverDate.getDate();

    dispatch(setWentToGYMDays(todaysDate));
    dispatch(setWentToGYM(!currentWentToGYM));

    updateWentToGYM.mutate({ wentToGYM: !currentWentToGYM });

    if (!currentWentToGYM) {
      dispatch(setRenderConfetti(true));
      await playSound();
    }
  };

  return (
    <>
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
          onPress={() => handleWentToGYM(wentToGYM)}
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
    </>
  );
}
