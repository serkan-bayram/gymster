import { useMutation, useQuery } from "@tanstack/react-query";
import {
  findTrackingsDoc,
  getGYMDays,
  getServerTime,
  updateWentToGYM,
} from "../db";
import { useSession } from "../session-context";
import { daysInMonth } from "../days-in-month";

export function useGetWentToGYMDays({
  setWentToGYMDays,
}: {
  setWentToGYMDays: (wentToGYMDays: number[]) => void;
}) {
  const { session } = useSession();

  // This query gets the days that user went to gym
  return useQuery({
    queryKey: ["wentToGYMDays"],
    queryFn: async () => {
      const serverTime = await getServerTime();

      if (serverTime && session) {
        // Is an array that contains day numbers that user went to gym
        const wentToGYMDays = await getGYMDays(session.uid, serverTime.date);

        setWentToGYMDays(wentToGYMDays);

        return { wentToGYMDays };
      }

      return null;
    },
  });
}

export function useUpdateWentToGYM() {
  const { session } = useSession();

  // This mutation updates the wentToGYM field of related document
  return useMutation({
    mutationKey: ["updateWentToGYM"],
    mutationFn: async ({ wentToGYM }: { wentToGYM: boolean }) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime && session) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        const doc = foundTrackingsDoc;

        if (doc) {
          await updateWentToGYM(doc.trackingsPath, wentToGYM);
        }
      }
    },
  });
}

// This query returns the calendar of current month
export function useGetGYMCalendar() {
  return useQuery({
    queryKey: ["GYMCalendar"],
    queryFn: async () => {
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
    },
  });
}
