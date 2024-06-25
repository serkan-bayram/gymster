import { TimeProvider } from "@/utils/time-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/utils/state/store";

import "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import functions from "@react-native-firebase/functions";

// set the host and the port property to connect to the emulator
// set these before any read/write operations occur to ensure it doesn't affect your Cloud Firestore data!
if (__DEV__) {
  firestore().useEmulator("192.168.1.14", 8080);
  functions().useEmulator("192.168.1.14", 5001);
  auth().useEmulator("http://192.168.1.14:9099");
}

// 30000
const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 0 } },
});

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TimeProvider>
          <Stack>
            <Stack.Screen options={{ headerShown: false }} name="(app)" />
          </Stack>
        </TimeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
