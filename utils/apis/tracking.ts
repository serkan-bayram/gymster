import { useQuery } from "@tanstack/react-query";
import { findTrackingsDoc, getServerTime } from "../db";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export function useGetTracking() {
  const user = useSelector((state: RootState) => state.session.user);

  // TODO: Some values does not rerender currently when user changed
  return useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      if (serverTime && user) {
        const foundTrackingsDoc = await findTrackingsDoc(
          user.uid,
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
