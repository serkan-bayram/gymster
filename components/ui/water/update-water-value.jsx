import { Pressable, Text, View } from "react-native";
import { ExtractSvg, PlusSvg } from "../svg";
import { useWater } from "@/utils/water-context";
import {
  findTrackingsDoc,
  getServerTime,
  updateHydrationProgress,
} from "@/utils/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";

const useCalculateProgress = (type, currentProgress, goal, updateValue) => {
  // If this happens somehow
  if (currentProgress > goal) {
    currentProgress = goal;
  }

  if (type === "increase") {
    const calculation = currentProgress + updateValue;

    // We check for any overflow, if new calculation is bigger than
    // goal, just return goal
    const newProgress = calculation >= goal ? goal : calculation;
    return newProgress;
  } else {
    const calculation = currentProgress - updateValue;

    const newProgress = calculation <= 0 ? 0 : calculation;
    return newProgress;
  }
};

// This component is used to increase or decrease current water progress
export function UpdateWaterValue({ currentProgress, setCurrentProgress }) {
  const { updateValue, goalValue: goal } = useWater();

  const handleClick = (type) => {
    const newProgress = useCalculateProgress(
      type,
      currentProgress,
      goal,
      updateValue
    );

    setCurrentProgress(newProgress);

    mutation.mutate({ newProgress: newProgress });
  };

  const { session } = useSession();

  const queryClient = useQueryClient();

  // TODO: This needs a debounce
  // TODO: for some reason mutation key is not working properly try again
  const mutation = useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries("trackings");
    },
    mutationFn: async ({ newProgress }) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        const { trackingsPath } = foundTrackingsDoc;

        const isUpdated = await updateHydrationProgress(
          trackingsPath,
          newProgress
        );
      }
    },
  });

  return (
    <View
      className="flex mr-6 gap-y-2 items-center justify-center
    "
    >
      <View className="flex flex-row gap-x-2">
        <Pressable
          onPress={() => handleClick("increase")}
          className=" bg-white border active:bg-gray-100
       active:scale-110 transition-all
     rounded-xl p-2  transition-300 "
        >
          <PlusSvg width={"20"} height={"20"} fill={"#7AA2E3"} />
        </Pressable>

        <Pressable
          onPress={() => handleClick("decrease")}
          className="bg-white border active:bg-gray-100
       active:scale-110 transition-all
     rounded-xl p-2   transition-300"
        >
          <ExtractSvg width="20" height="20" fill="#7AA2E3" />
        </Pressable>
      </View>
      <Text>{updateValue} ml kadar</Text>
    </View>
  );
}
