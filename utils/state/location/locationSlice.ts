import { createSlice } from "@reduxjs/toolkit";

interface LocationState {
  latitude: number;
  longitude: number;
  timestamp: number;
  distance: number;
  speed: number;
}

const initialState: LocationState[] = [];

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const neededDataCount = 5;

      // We get neededDataCount times location
      if (state.length < neededDataCount) {
        state.push(action.payload);
      }

      // We calculate the distance and speed over these location datas
      if (state.length === neededDataCount) {
        let totalDistance = 0;
        let totalTime = 0;

        for (let i = 1; i < state.length; i++) {
          const coord1 = state[i - 1];
          const coord2 = state[i];

          const distance = calculateDistance(coord1, coord2);

          const timeDiff = (state[i].timestamp - state[i - 1].timestamp) / 1000; // convert milliseconds to seconds

          totalDistance += distance;
          totalTime += timeDiff;
        }

        const averageSpeed = totalDistance / (totalTime / 3600);

        console.log("Total Distance:", totalDistance, "km");
        console.log("Average Speed:", averageSpeed, "km/h");

        state.length = 0;
      }
    },
  },
  extraReducers: (builder) => {},
});

function calculateDistance(coord1: LocationState, coord2: LocationState) {
  const R = 6371; // Radius of the Earth in km

  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

// Helper function to convert degrees to radians
function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
