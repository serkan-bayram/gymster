import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { findTrackingsDoc } from "../db/tracking";
import { updateHydrationProgress } from "../db/water";

export function useUpdateWater() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryClient = useQueryClient();

  // TODO: This needs a debounce
  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tracking"] });
    },
    mutationFn: async ({ newProgress }: { newProgress: number }) => {
      if (!user) return null;

      const foundTrackingsDoc = await findTrackingsDoc(user.uid);

      if (foundTrackingsDoc) {
        const { trackingsPath } = foundTrackingsDoc;

        const isUpdated = await updateHydrationProgress(
          trackingsPath,
          newProgress
        );
      }
    },
  });
}
