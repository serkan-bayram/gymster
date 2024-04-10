import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { LandingMascot } from "@/components/ui/landing-mascot";
import { LandingText } from "@/components/ui/landing-text";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useSession } from "@/utils/session-context";

export default function App() {
  const { loading, signIn } = useSession();

  return (
    <View className="bg-background flex  h-full pt-8">
      <View className="flex-1   flex items-center ">
        <View className="flex-[1_1_70%]">
          <LandingMascot />
        </View>
        <View className="flex-[1_1_30%]">
          <LandingText />
        </View>
      </View>
      <View
        className="p-24 pt-12 rounded-tl-[40px] 
          rounded-tr-[40px] bg-primary border-2 border-b-0 flex items-center 
          justify-center"
      >
        <View className="w-full gap-y-2 flex items-center">
          <Text className="text-lg text-white font-bold">Let's start</Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={signIn}
            disabled={loading}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
