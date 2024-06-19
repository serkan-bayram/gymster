import { View } from "react-native";
import { ProfileHeader } from "@/components/profile/profile-header";

export default function Profile() {
  return (
    <View className="pt-16 flex-1 pb-20 px-4 bg-background">
      <View className=" flex-1 flex  ">
        <ProfileHeader />
      </View>
    </View>
  );
}
