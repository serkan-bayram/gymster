import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { setIsLoading, setSession } from "@/utils/state/session/sessionSlice";
import { User } from "@/utils/types/session";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { FullScreenLoading } from "@/components/loading";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  function onAuthStateChanged(authUser: FirebaseAuthTypes.User | null) {
    if (authUser) {
      const userObject: User = {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        info: null,
      };

      dispatch(setSession(userObject));

      router.replace("/home");
      dispatch(setIsLoading(false));
    } else {
      dispatch(setSession(null));
      dispatch(setIsLoading(false));
      SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "925921052788-ca77bp1oklsvdn453kuskdlhba6em8un.apps.googleusercontent.com",
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
};

export default function AppLayout() {
  useAuth();

  const isLoading = useSelector((state: RootState) => state.session.isLoading);

  if (isLoading) return <FullScreenLoading />;

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
