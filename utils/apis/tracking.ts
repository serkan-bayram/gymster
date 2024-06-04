import { useQuery } from "@tanstack/react-query";
import { findTrackingsDoc, getServerTime } from "../db";
import { useSession } from "../session-context";

export function useGetTracking() {
  const { session } = useSession();

  // TODO: Some values does not rerender currently when user changed
  return useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      if (serverTime && session) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        // Trackings document is just created so there is not any value in it
        if (foundTrackingsDoc === null) {
          return null;
        }

        const { trackingsDoc } = foundTrackingsDoc;

        return trackingsDoc;
      }

      return null;
    },
  });
}
