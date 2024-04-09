import { useSession } from "@/utils/session-context";
import { Redirect, Stack } from "expo-router";

// client id 155525349831-lg8mhs4ikhd0gki8vafooep9s1h2k60f.apps.googleusercontent.com

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
  return <Stack />;
}
