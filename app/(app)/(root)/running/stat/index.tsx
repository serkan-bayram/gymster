import { Heading } from "@/components/heading";
import { RootState } from "@/utils/state/store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getServerTime } from "@/utils/db";

interface MaxDistance {
  // label -> date of day
  label: string;
  // value -> distance of day
  value: number;
}

// Loops over runs and returns an array of distances of days
function useMaxDistances({ month }: { month: string }) {
  const runs = useSelector((state: RootState) => state.running.allRuns);

  const [maxDistances, setMaxDistances] = useState<MaxDistance[]>([]);

  useEffect(() => {
    const maxDistancesArray: MaxDistance[] = [];

    runs.forEach((run) => {
      if (month === "") return;

      const date = run.dateAsText || "";

      if (!date.includes(month)) return;

      const day = date.split(" ")[0];

      // run.runs -> every "run" is made of multiple runs
      // because user can run more than 1 in one day but they are all
      // categorized under 1 day
      const distance = run.runs.reduce(
        (total, dist) => total + dist.distance,
        0
      );

      maxDistancesArray.push({ label: day, value: distance });
    });

    setMaxDistances(maxDistancesArray.reverse());
  }, [month]);

  return { maxDistances: maxDistances };
}

function Picker({
  pickerRef,
  selectedValue,
  setValue,
}: {
  pickerRef: any;
  selectedValue: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <View className="hidden">
      <RNPicker
        ref={pickerRef}
        selectedValue={selectedValue}
        onValueChange={(pickedValue) =>
          pickedValue === "none"
            ? setValue(selectedValue)
            : setValue(pickedValue)
        }
      >
        <RNPicker.Item label="İptal" value="none" />
        <RNPicker.Item label="Ocak" value="Ocak" />
        <RNPicker.Item label="Şubat" value="Şubat" />
        <RNPicker.Item label="Mart" value="Mart" />
        <RNPicker.Item label="Nisan" value="Nisan" />
        <RNPicker.Item label="Mayıs" value="Mayıs" />
        <RNPicker.Item label="Haziran" value="Haziran" />
        <RNPicker.Item label="Temmuz" value="Temmuz" />
        <RNPicker.Item label="Ağustos" value="Ağustos" />
        <RNPicker.Item label="Eylül" value="Eylül" />
        <RNPicker.Item label="Ekim" value="Ekim" />
        <RNPicker.Item label="Kasım" value="Kasım" />
        <RNPicker.Item label="Aralık" value="Aralık" />
      </RNPicker>
    </View>
  );
}

// Get's the current month
function useCurrentMonth() {
  return useQuery({
    queryKey: ["getCurrentMonth"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      if (serverTime) {
        const date = new Date(serverTime.date.toDate());

        const month = date.toLocaleDateString("tr-TR", { month: "long" });

        return month;
      }

      return null;
    },
  });
}

export default function Stat() {
  const currentMonth = useCurrentMonth();

  const [month, setMonth] = useState<string>(currentMonth.data || "Ocak");
  const { maxDistances } = useMaxDistances({ month: month });

  useEffect(() => {
    if (currentMonth.data) {
      setMonth(currentMonth.data);
    }
  }, [currentMonth.data]);

  const monthPicker = useRef<any>(null);

  return (
    <>
      <ScrollView className="pt-16 pb-20 px-4 bg-background flex-1 ">
        <Heading heading="Koşu İstatisikleri" />
        <View className="mt-4">
          <View className="mb-4 flex flex-row justify-between">
            <Text className="font-semibold text-lg">Mesafe</Text>
            <Pressable
              onPress={() => monthPicker.current.focus()}
              className="bg-secondary rounded-lg p-2 px-4 justify-between items-center flex flex-row"
            >
              <Text className="text-white">{month}</Text>
              <MaterialIcons name="expand-more" size={16} color="white" />
            </Pressable>
          </View>
          {maxDistances.length > 0 ? (
            <LineChart isAnimated data={maxDistances} />
          ) : currentMonth.isPending ? (
            <View className="flex items-center justify-center mt-8">
              <Text>Veriler yükleniyor...</Text>
            </View>
          ) : (
            <View className="flex items-center justify-center mt-8">
              <Text>{month} ayı için hiç veri bulunamadı.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Picker
        setValue={setMonth}
        selectedValue={month}
        pickerRef={monthPicker}
      />
    </>
  );
}
