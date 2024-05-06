import { SessionProvider } from "@/utils/session-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, Stack } from "expo-router";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SessionProvider>
    </QueryClientProvider>
  );
}
