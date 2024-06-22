import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "@react-native-firebase/auth";
import { SessionState, User } from "@/utils/types/session";
import firestore from "@react-native-firebase/firestore";
import functions, {
  FirebaseFunctionsTypes,
} from "@react-native-firebase/functions";

const initialState: SessionState = {
  user: null,
  // is app loading
  isLoading: true,
  // Does user signin in or authenticating with localstorage?
  isSignIn: false,
};

// We can turn this into a cloud function
export const createUser = async (user: User) => {
  try {
    await functions().httpsCallable("createUser")(user);
    console.log("User is created: ", user);
    return true;
  } catch (error) {
    console.log("Error on createUser: ", error);
    return null;
  }
};

export const signIn = createAsyncThunk("session/signIn", async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const { additionalUserInfo, user } = await auth().signInWithCredential(
      googleCredential
    );

    // If user is not saved to firebase
    if (additionalUserInfo?.isNewUser) {
      const userObject: User = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        info: null,
      };

      // Create user in firestore
      await createUser(userObject);
    }
  } catch (error) {
    console.log("Error on sign in: ", error);
  }
});

export const signOut = createAsyncThunk("session/signOut", async () => {
  try {
    await GoogleSignin.revokeAccess();

    auth()
      .signOut()
      .then(async () => {
        console.log("User signed out!");
      });
  } catch (error) {
    console.error("Error on sign out: ", error);
  }
});

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsSignIn: (state, action) => {
      state.isSignIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state) => {
      state.isSignIn = true;
    });
  },
});

export const { setSession, setIsLoading, setIsSignIn } = sessionSlice.actions;

export default sessionSlice.reducer;
