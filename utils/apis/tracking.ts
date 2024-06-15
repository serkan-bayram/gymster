import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { findTrackingsDoc } from "../db/tracking";
import { setWentToGYM } from "../state/gymDays/gymDaysSlice";
import { setProgress } from "../state/water/waterSlice";

export function useGetTracking() {
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch<AppDispatch>();

  const queryFn = async () => {
    if (!user) return null;

    const foundTrackingsDoc = await findTrackingsDoc(user.uid);
    // Trackings document is just created so there is not any value in it

    if (foundTrackingsDoc === null) {
      return null;
    }

    const { trackingsDoc } = foundTrackingsDoc;

    if (trackingsDoc.wentToGYM) {
      dispatch(setWentToGYM(trackingsDoc.wentToGYM));
    }

    if (trackingsDoc.hydration) {
      dispatch(setProgress(trackingsDoc.hydration.progress));
    }

    return trackingsDoc;
  };

  // TODO: Some values does not rerender currently when user changed
  return useQuery({
    queryKey: ["tracking"],
    queryFn: queryFn,
  });
}
