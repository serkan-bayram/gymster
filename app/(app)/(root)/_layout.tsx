import { SplashScreen, Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { TabBar } from "@/components/tab-bar";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome6,
  Feather,
  Ionicons,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";

function cacheFonts(fonts: any) {
  return fonts.map((font: any) => Font.loadAsync(font));
}

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.session.user);

  useEffect(() => {
    if (!user) router.replace("/");
  }, [user]);

  const isAppReady = useCache();

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <View className="flex-1 bg-background">
          <Stack>
            <Stack.Screen name="home/index" options={{ headerShown: false }} />
            <Stack.Screen
              name="tracking/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="workout/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="user-info/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="meals-details/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="running/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="running/stat/index"
              options={{ headerShown: false }}
            />
          </Stack>
          <TabBar />

          <StatusBar style="auto" />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const useCache = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  // Load resources that we need before rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const fontAssets = cacheFonts([
          MaterialIcons.font,
          MaterialCommunityIcons.font,
          AntDesign.font,
          FontAwesome6.font,
          Feather.font,
          Ionicons.font,
          FontAwesome.font,
          Octicons.font,
        ]);

        await Promise.all([...fontAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isAppReady;
};
