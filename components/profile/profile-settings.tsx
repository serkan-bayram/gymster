import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";
import { signOut } from "@/utils/state/session/sessionSlice";
import { Divider } from "../ui/divider";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { setNotification } from "@/utils/state/notification/notificationSlice";

interface SettingsItem {
  onPress: () => void;
  icon: ReactNode;
  text: string;
}

function SettingsItem({ onPress, icon, text }: SettingsItem) {
  return (
    <TouchableOpacity
      className="mt-2 flex flex-row items-center gap-x-1"
      onPress={onPress}
    >
      {icon}
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

export function ProfileSettings() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  return (
    <View className="flex flex-row">
      {isOpen && (
        <View
          style={styles.settingsContainer}
          className="bg-white p-3 min-w-[128px] rounded-lg relative top-5 right-1"
        >
          <SettingsItem
            text="Bilgilerimi Güncelle"
            icon={<AntDesign name="idcard" size={18} color="black" />}
            onPress={() => {
              setIsOpen(false);
              router.push("/user-info?update=true");
            }}
          />
          <Divider type="horizontal" dividerClassName="mt-auto " />
          <SettingsItem
            text="Çıkış Yap"
            icon={<FontAwesome name="sign-out" size={18} color="black" />}
            onPress={() => {
              setIsOpen(false);
              dispatch(signOut());
            }}
          />
        </View>
      )}

      <TouchableOpacity onPress={() => setIsOpen((prevValue) => !prevValue)}>
        <Ionicons name="settings-sharp" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    elevation: 3,
  },
});
