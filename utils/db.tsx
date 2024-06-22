import functions from "@react-native-firebase/functions";

interface ServerTime {
  date: Date;
}

// We can use cloud functions instead of updateServerTime
export async function getServerTime(): Promise<null | ServerTime> {
  try {
    const serverTime = await functions().httpsCallable("getServerTime")();

    if (!serverTime.data) return null;

    return { date: new Date(JSON.parse(serverTime.data)) };
  } catch (error) {
    console.log("Error on getServerTime: ", error);
    return null;
  }
}
