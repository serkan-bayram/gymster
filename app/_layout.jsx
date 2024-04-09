import { SessionProvider } from "@/utils/session-context";
import { Slot } from "expo-router";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
