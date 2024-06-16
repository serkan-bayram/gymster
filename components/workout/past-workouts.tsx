import { useGetWorkouts } from "@/utils/apis/workout";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Exercise } from "@/components/workout/exercise";
import * as Crypto from "expo-crypto";
import { Divider } from "@/components/ui/divider";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

export function PastWorkouts() {
  const workouts = useSelector((state: RootState) => state.workout.allWorkouts);

  return (
    <>
      <Text className="text-xl font-bold">Geçmiş Antrenmanlar</Text>
      {workouts &&
        workouts.map((workout) => {
          if (workout.workout.length <= 0) {
            return null;
          }

          const documentPath = workout.documentPath;

          return (
            <View key={Crypto.randomUUID()} className="mt-3">
              <View className="flex flex-row items-center mb-2">
                <Feather name="calendar" size={20} color="black" />
                <Text className="ml-1 font-semibold text-lg">
                  {`${workout.date.day} ${workout.date.month}`}
                </Text>
              </View>

              {workout.workout.map((work) => (
                <Exercise
                  key={Crypto.randomUUID()}
                  workout={workout.workout}
                  documentPath={documentPath}
                  exercise={work}
                  darkMode={true}
                />
              ))}
            </View>
          );
        })}
    </>
  );
}
