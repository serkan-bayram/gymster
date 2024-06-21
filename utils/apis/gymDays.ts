import { useMutation, useQuery } from "@tanstack/react-query";
import { getServerTime } from "../db";
import { daysInMonth } from "../days-in-month";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { getGYMDays, updateWentToGYM } from "../db/gymDays";
import { findTrackingsDoc } from "../db/tracking";
import { setWentToGYMDays } from "../state/gymDays/gymDaysSlice";

export function useGetWentToGYMDays() {
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch<AppDispatch>();

  const queryFn = async () => {
    const serverTime = await getServerTime();

    if (!user || !serverTime) return null;

    // Is an array that contains day numbers that user went to gym
    const wentToGYMDays = await getGYMDays(user.uid, serverTime.date);

    dispatch(setWentToGYMDays(wentToGYMDays));

    return { wentToGYMDays: wentToGYMDays };
  };

  // This query gets the days that user went to gym
  return useQuery({
    queryKey: ["wentToGYMDays"],
    queryFn: queryFn,
  });
}

export function useUpdateWentToGYM() {
  const user = useSelector((state: RootState) => state.session.user);

  const mutationFn = async ({ wentToGYM }: { wentToGYM: boolean }) => {
    if (!user) return null;

    const foundTrackingsDoc = await findTrackingsDoc(user.uid);

    if (!foundTrackingsDoc) return null;

    const { trackingsPath } = foundTrackingsDoc;

    const isUpdated = await updateWentToGYM(trackingsPath, wentToGYM);

    console.log("isUpdated: ", isUpdated);
  };

  // This mutation updates the wentToGYM field of related document
  return useMutation({
    mutationKey: ["updateWentToGYM"],
    mutationFn: mutationFn,
  });
}

// This query returns the calendar of current month
export function useGetGYMCalendar() {
  const queryFn = async () => {
    const serverTime = await getServerTime();

    if (serverTime) {
      const serverDate = new Date(serverTime.date.toDate());

      const daysCount = daysInMonth(
        serverDate.getMonth(),
        serverDate.getFullYear()
      );

      const todaysDate = serverDate.getDate();
      const monthName = serverDate.toLocaleString("default", {
        month: "long",
      });

      return { daysCount, todaysDate, monthName };
    }

    return null;
  };

  return useQuery({
    queryKey: ["GYMCalendar"],
    queryFn: queryFn,
  });
}
