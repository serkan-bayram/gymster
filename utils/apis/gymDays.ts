import { useMutation, useQuery } from "@tanstack/react-query";
import { getServerTime } from "../db";
import { daysInMonth } from "../days-in-month";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { getGYMDays, updateWentToGYM } from "../db/gymDays";
import { findTrackingsDoc } from "../db/tracking";

export function useGetWentToGYMDays({
  setWentToGYMDays,
}: {
  setWentToGYMDays: (wentToGYMDays: number[]) => void;
}) {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    const serverTime = await getServerTime();

    if (!user || !serverTime) return null;

    // Is an array that contains day numbers that user went to gym
    const wentToGYMDays = await getGYMDays(user.uid, serverTime.date);

    setWentToGYMDays(wentToGYMDays);

    return { wentToGYMDays };
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

    const doc = foundTrackingsDoc;

    if (doc) {
      await updateWentToGYM(doc.trackingsPath, wentToGYM);
    }
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
