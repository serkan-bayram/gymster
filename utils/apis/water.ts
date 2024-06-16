import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { findTrackingsDoc, getAllTrackings } from "../db/tracking";
import { updateHydrationProgress } from "../db/water";

export function useUpdateWater() {
  const user = useSelector((state: RootState) => state.session.user);

  // TODO: This needs a debounce
  return useMutation({
    onSuccess: async () => {
      // TODO: Creates a visual bug, maybe invalidate after a couple of seconds
      // await queryClient.invalidateQueries({ queryKey: ["tracking"] });
    },
    mutationFn: async ({ newProgress }: { newProgress: number }) => {
      if (!user) return null;

      const foundTrackingsDoc = await findTrackingsDoc(user.uid);

      if (foundTrackingsDoc) {
        const { trackingsPath } = foundTrackingsDoc;

        await updateHydrationProgress(trackingsPath, newProgress);
      }
    },
  });
}

export function useGetAllWaterData() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    if (!user) return null;

    const data = await getAllTrackings({ uid: user.uid });

    if (!data) return null;

    return data;
  };

  return useQuery({ queryKey: ["getAllWaterData"], queryFn: queryFn });
}
