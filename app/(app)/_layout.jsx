import { useSession } from "@/utils/session-context";
import { Redirect, Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function AppLayout() {
  const { session } = useSession();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <View className="pt-16 flex-1 gap-y-4 bg-background">
          <Slot />
          <StatusBar style="auto" />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
