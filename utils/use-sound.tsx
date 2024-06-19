import { AVPlaybackSource, Audio } from "expo-av";
import { useEffect, useState } from "react";

// A custom hook to handle sound playing
export function useSound({ source }: { source: AVPlaybackSource }) {
  const [sound, setSound] = useState<Audio.Sound | undefined>();

  async function playSound() {
    console.log("Loading Sound");

    const { sound } = await Audio.Sound.createAsync(source);

    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return playSound;
}
