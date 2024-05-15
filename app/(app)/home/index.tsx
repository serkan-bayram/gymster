import { Heading } from "@/components/heading";
import { useSession } from "@/utils/session-context";
import { ScrollView } from "react-native-gesture-handler";
import { CardWithLink } from "@/components/card-with-link";
import { Metrics } from "@/components/metrics";

export default function Home() {
  const { session } = useSession();

  const firstName = session?.displayName?.split(" ")[0];

  return (
    <ScrollView className="bg-background   ">
      <Heading heading={`Hoş geldin, ${firstName}`} />
      <CardWithLink
        href="/tracking"
        text="Düzenle & Keşfet"
        subText="Antrenmanlarını"
        imageSrc={require("@/assets/exercise-mascot.png")}
      />
      <Metrics />
    </ScrollView>
  );
}
