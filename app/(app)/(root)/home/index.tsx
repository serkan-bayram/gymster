import { Heading } from "@/components/heading";
import { ScrollView } from "react-native-gesture-handler";
import { CardWithLink } from "@/components/card-with-link";
import { Metrics } from "@/components/metrics";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

export default function Home() {
  const user = useSelector((state: RootState) => state.session.user);

  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Hammy";

  return (
    <View className="flex-1 pt-16 pb-20 px-4 bg-background">
      <ScrollView>
        <Heading heading={`Hoş geldin, ${firstName}`} />
        <CardWithLink
          href="/tracking"
          text="Düzenle & Keşfet"
          subText="Antrenmanlarını"
          imageSrc={require("@/assets/exercise-mascot.png")}
        />
        <Metrics />
      </ScrollView>
    </View>
  );
}
