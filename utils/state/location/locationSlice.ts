import { createSlice } from "@reduxjs/toolkit";

interface LocationState {
  latitude: number;
  longitude: number;
}

const initialState: LocationState = {
  latitude: 0,
  longitude: 0,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
