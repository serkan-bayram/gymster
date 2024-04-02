import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { LandingMascot } from "@/components/ui/landing-mascot";
import { LandingText } from "@/components/ui/landing-text";
import { PrimaryButton } from "@/components/primary-button";
import { Input } from "@/components/input";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="bg-background flex  h-full pt-8">
      <View className="flex-1  flex items-center gap-y-6">
        <LandingMascot />
        <LandingText />
      </View>
      <View
        className="flex-1 mt-12 rounded-tl-[40px] 
          rounded-tr-[40px] bg-primary border-2 border-b-0 flex items-center 
          justify-center"
      >
        <View className="w-full gap-y-8 flex items-center">
          <Input placeholder="Email" className="w-[80%]" />
          <Link className="w-[80%]" href={"/tracking"} asChild>
            <PrimaryButton text="Get Started" />
          </Link>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
