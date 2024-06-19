import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { RunsDB } from "@/utils/types/runs";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";

function Stat({
  heading,
  subHeading,
  icon,
}: {
  heading: string;
  subHeading: string;
  icon: React.ReactNode;
}) {
  return (
    <Pressable className="mr-3 flex justify-between border border-gray rounded-lg p-2 w-32">
      <Text className="font-semibold">{heading}</Text>
      <View className="flex flex-row justify-between items-center">
        <Text className="font-bold">{subHeading}</Text>
        {icon}
      </View>
    </Pressable>
  );
}

// Fastest speed, most distance etc
export function TopStats({ data }: { data: RunsDB[] }) {
  const { maxDistance, maxAverageSpeed, maxRunTimeString } =
    useCalculateTopStats(data);

  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-bold text-xl">Rekorlar</Text>

        <Link href={"/running/stat"}>
          <Octicons name="link-external" size={24} color="black" />
        </Link>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        className="mt-3 "
      >
        <Stat
          heading="En uzun koşulan mesafe"
          subHeading={`${maxDistance.toFixed(1)} m`}
          icon={
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={24}
              color="black"
            />
          }
        />
        <Stat
          heading="En yüksek ortalama hız"
          subHeading={`${maxAverageSpeed.toFixed(1)} km/dk`}
          icon={
            <MaterialCommunityIcons
              name="speedometer"
              size={24}
              color="black"
            />
          }
        />
        <Stat
          heading="En çok yakılan kalori"
          subHeading="536 kcal"
          icon={<FontAwesome6 name="fire" size={24} color="black" />}
        />
        <Stat
          heading="Koşulan en uzun süre"
          subHeading={maxRunTimeString}
          icon={<Ionicons name="timer-sharp" size={24} color="black" />}
        />
      </ScrollView>
    </View>
  );
}

const useCalculateTopStats = (data: RunsDB[]) => {
  const allRuns = data.flatMap((entry) => entry.runs);

  let maxDistance = 0;
  let maxAverageSpeed = 0;
  let maxRunTime = new Date();
  maxRunTime.setHours(0, 0, 0, 0);

  // Calculate max values
  allRuns.forEach((run) => {
    if (run.distance > maxDistance) {
      maxDistance = run.distance;
    }

    if (run.averageSpeed > maxAverageSpeed) {
      maxAverageSpeed = run.averageSpeed;
    }

    const runTime = new Date();
    runTime.setHours(
      run.runTime.hours,
      run.runTime.minutes,
      run.runTime.seconds,
      0
    );

    if (runTime.getTime() > maxRunTime.getTime()) {
      maxRunTime = runTime;
    }
  });

  const maxRunTimeString = `${maxRunTime.getHours()} s ${maxRunTime.getMinutes()} dk`;

  return { maxDistance, maxAverageSpeed, maxRunTimeString };
};
