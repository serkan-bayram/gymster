import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "@react-native-firebase/auth";
import { SessionState, User } from "@/utils/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const initialState: SessionState = {
  user: null,
  isLoading: false,
};

// Save user to DB if it is not already saved
// We can turn this into a cloud function
export const saveUser = async (user: User) => {
  const findUser = await firestore()
    .collection("Users")
    .where("uid", "==", user.uid)
    .get();

  if (findUser.docs.length <= 0) {
    const usersCollection = firestore().collection("Users");

    usersCollection.add(user).then(() => console.log("User is saved to DB."));
  }
};

export const signIn = createAsyncThunk("session/signIn", async () => {
  try {
    // Set local storage if UserInfo screen has skipped before
    // await checkDidSkipped();

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken
    );

    await auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.log("Error on sign in: ", error);
  }
});

export const signOut = createAsyncThunk("session/signOut", async () => {
  try {
    GoogleSignin.revokeAccess();

    auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem("session");

        console.log("User signed out!");
      });
  } catch (error) {
    console.error("Error on sign out: ", error);
  }
});

export const readStorageSession = createAsyncThunk(
  "session/readStorageSession",
  async () => {
    try {
      const readSession = await AsyncStorage.getItem("session");

      if (readSession) {
        return JSON.parse(readSession);
      }

      return null;
    } catch (error) {
      console.log("Can't read storage session: ", error);
    }
  }
);

export const saveSessionToStorage = createAsyncThunk(
  "session/saveSessionToStorage",
  async (session: User | null) => {
    try {
      // Save session to local storage
      const jsonSession = JSON.stringify(session);

      await AsyncStorage.setItem("session", jsonSession);
    } catch (error) {
      console.log("Error on saving session to local storage: ", error);
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, payload) => {
      state.user = payload.payload;
    },
  },
  extraReducers: (builder) => {
    // Read session from local storage and setSession if exists
    builder.addCase(readStorageSession.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(signOut.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setSession } = sessionSlice.actions;

export default sessionSlice.reducer;
