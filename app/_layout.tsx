import { SessionProvider } from "@/utils/session-context";
import { TimeProvider } from "@/utils/time-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TimeProvider>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </TimeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
