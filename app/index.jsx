import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { LandingMascot } from "@/components/ui/landing-mascot";
import { LandingText } from "@/components/ui/landing-text";
import { PrimaryButton } from "@/components/primary-button";
import { Input } from "@/components/input";
import { Link } from "expo-router";
import { auth } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function App() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSignIn = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
        <View className="w-full gap-y-4 flex items-center">
          <Input setState={setEmail} placeholder="Email" className="w-[80%]" />
          <Input
            setState={setPassword}
            placeholder="Password"
            className="w-[80%]"
          />
          <Link className="w-[80%]" href={"/tracking"} asChild>
            <PrimaryButton onPress={handleSignIn} text="Get Started" />
          </Link>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
