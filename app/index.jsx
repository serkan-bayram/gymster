import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { LandingMascot } from "@/components/ui/landing-mascot";
import { LandingText } from "@/components/ui/landing-text";
import { PrimaryButton } from "@/components/primary-button";
import { Input } from "@/components/input";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useSession } from "@/utils/session-context";

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });
  }, []);

  const [userInfo, setUserInfo] = useState(null);
  const { setSession } = useSession();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      setUserInfo({ userInfo });
      setSession({ userInfo });

      console.log({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo({ user: null });

      setSession({ user: null });
      // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="bg-background flex  h-full pt-8">
      <View className="flex-1  flex items-center gap-y-6">
        <LandingMascot />
        <LandingText />
        {userInfo && (
          <Text className="text-black">
            aaaa{JSON.stringify(userInfo.user)}
          </Text>
        )}
      </View>
      <View
        className="flex-1 mt-12 rounded-tl-[40px] 
          rounded-tr-[40px] bg-primary border-2 border-b-0 flex items-center 
          justify-center"
      >
        <View className="w-full gap-y-4 flex items-center">
          <Input placeholder="Email" className="w-[80%]" />
          <Input placeholder="Password" className="w-[80%]" />
          {/* <Link className="w-[80%]" href={"/tracking"} asChild> */}
          <PrimaryButton onPress={() => signIn()} text="Get Started" />
          <PrimaryButton onPress={() => signOut()} text="Sign out" />
          {/* </Link> */}
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
