import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import {
  readStorageSession,
  saveSessionToStorage,
  saveUser,
  setSession,
} from "@/utils/state/session/sessionSlice";
import { User } from "@/utils/types/session";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// TODO: handle didSkipeed
const useNavigateUser = () => {
  const { user } = useSelector((state: RootState) => state.session);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Why timeouts: https://github.com/expo/router/issues/740
      setTimeout(() => {
        router.replace("/home");
      }, 0);
    } else {
      setTimeout(() => {
        router.replace("/");
      }, 0);
    }
  }, [user]);
};

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });

    // Read session from storage and setSession
    dispatch(readStorageSession());

    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userObject: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        // Save user to DB if not exists
        await saveUser(userObject);

        // Save session to localStorage
        dispatch(saveSessionToStorage(userObject));

        dispatch(setSession(userObject));
      } else {
        // User is problably signed out
        dispatch(setSession(null));

        // Remove session from localStorage
        dispatch(saveSessionToStorage(null));
      }
    });

    return subscriber; // unsubscribe on unmount
  }, []);
};

// TODO: This seems to not work
export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function AppLayout() {
  useAuth();
  useNavigateUser();

  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen
        name="index"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
