import { Heading } from "@/components/heading";
import { ScrollView } from "react-native-gesture-handler";
import { CardWithLink } from "@/components/card-with-link";
import { Metrics } from "@/components/metrics";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/db/user-info";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FullScreenLoading } from "@/components/loading";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.session);

  const query = useHandleUserInfo();

  if (query.isPending) return <FullScreenLoading />;

  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Hammy";

  return (
    <View className="flex-1 pt-16 pb-20 px-4 bg-background">
      <ScrollView>
        <Heading heading={`Hoş geldin, ${firstName}`} />
        <CardWithLink
          href="/workout"
          text="Düzenle & Keşfet"
          subText="Antrenmanlarını"
          imageSrc={require("@/assets/exercise-mascot.png")}
        />
        <Metrics />
      </ScrollView>
    </View>
  );
}

// A custom hook to navigate user to user-info
// screen, if neccessary
const useHandleUserInfo = () => {
  const router = useRouter();

  const { user, isSignIn } = useSelector((state: RootState) => state.session);

  const query = useQuery({
    // TODO: This line is problamatic
    // enabled: isSignIn,
    queryKey: ["didUserSavedInfo"],
    queryFn: async () => {
      if (!user) return null;

      const dbUser = await getUser({ uid: user.uid });

      // User has not saved the info
      if (!dbUser?.info) {
        return false;
      }

      return true;
    },
  });

  useEffect(() => {
    // User has not saved any user info
    // and user is just signed in
    if (isSignIn && query.data === false) {
      router.push("/user-info");
    }
  }, [isSignIn, query.data]);

  return query;
};
