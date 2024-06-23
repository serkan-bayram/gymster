import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useQuery } from "@tanstack/react-query";
import functions from "@react-native-firebase/functions";
import { useState } from "react";
import { View } from "react-native";

export function Map() {
  const { data: apiKey, isPending: isAPIKeyPending } = useGetGoogleMapsAPIKey();

  const [coordinates] = useState([
    {
      latitude: 48.8587741,
      longitude: 2.2069771,
    },
    {
      latitude: 48.8323785,
      longitude: 2.3361663,
    },
  ]);

  if (isAPIKeyPending) return <View></View>;

  return (
    <MapView
      className="flex-1 w-full h-full "
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0121,
      }}
    >
      <Marker coordinate={coordinates[0]} />
      <Marker coordinate={coordinates[1]} />
      {apiKey && (
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={apiKey}
          strokeWidth={4}
          strokeColor="#111111"
        />
      )}
    </MapView>
  );
}

const useGetGoogleMapsAPIKey = () => {
  const queryFn = async () => {
    const apiKey = await functions().httpsCallable("getGoogleMapsAPIKey")();

    if (apiKey.data) {
      return apiKey.data;
    }

    return null;
  };

  return useQuery({ queryKey: ["getGoogleMapsAPIKey"], queryFn: queryFn });
};
