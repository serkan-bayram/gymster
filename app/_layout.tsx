import { TimeProvider } from "@/utils/time-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/utils/state/store";

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
