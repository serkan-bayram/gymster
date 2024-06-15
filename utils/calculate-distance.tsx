import { LocationState } from "./types/runs";

// Haversine formula
export function calculateDistance(
  coord1: LocationState,
  coord2: LocationState
) {
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
