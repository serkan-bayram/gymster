import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { findTrackingsDoc, getAllTrackings } from "../db/tracking";
import { updateHydrationProgress } from "../db/water";
import { getServerTime } from "../db";

export function useUpdateWater() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryClient = useQueryClient();

  // TODO: This needs a debounce
  return useMutation({
    onSuccess: async () => {
      // TODO: Creates a visual bug, maybe invalidate after a couple of seconds
      // await queryClient.invalidateQueries({ queryKey: ["tracking"] });
      await queryClient.invalidateQueries({ queryKey: ["getAllWaterData"] });
    },
    mutationFn: async ({ newProgress }: { newProgress: number }) => {
      if (!user) return null;

      const foundTrackingsDoc = await findTrackingsDoc(user.uid);

      if (!foundTrackingsDoc) return null;

      const { trackingsPath } = foundTrackingsDoc;

      await updateHydrationProgress(trackingsPath, newProgress);
    },
  });
}

export interface ProgressData {
  progress: number;
  date: string;
}

export function useGetAllWaterData() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    if (!user) return null;

    const trackings = await getAllTrackings({ uid: user.uid });

    if (!trackings) return null;

    const progressData: ProgressData[] = [];

    trackings.forEach((tracking) => {
      const progress = tracking.hydration?.progress;
      const createdAt = tracking.createdAt;
      if (progress && createdAt) {
        const date = new Date(createdAt.toDate());
        progressData.push({ progress: progress, date: `${date}` });
      }
    });

    const serverTime = await getServerTime();

    if (!serverTime) return null;

    return {
      progress: progressData,
      currentTime: serverTime.date,
    };
  };

  return useQuery({ queryKey: ["getAllWaterData"], queryFn: queryFn });
}
