import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { findTrackingsDoc } from "../db/tracking";

export function useGetTracking() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    if (!user) return null;

    const foundTrackingsDoc = await findTrackingsDoc(user.uid);
    // Trackings document is just created so there is not any value in it
    if (foundTrackingsDoc === null) {
      return null;
    }

    const { trackingsDoc } = foundTrackingsDoc;

    return trackingsDoc;
  };

  // TODO: Some values does not rerender currently when user changed
  return useQuery({
    queryKey: ["tracking"],
    queryFn: queryFn,
  });
}
