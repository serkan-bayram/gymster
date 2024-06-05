import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findTrackingsDoc,
  getServerTime,
  updateHydrationProgress,
} from "../db";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export function useUpdateWater() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryClient = useQueryClient();

  // TODO: This needs a debounce
  // TODO: for some reason mutation key is not working properly try again
  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
    mutationFn: async ({ newProgress }: { newProgress: number }) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime && user) {
        const foundTrackingsDoc = await findTrackingsDoc(
          user.uid,
          serverTime.date
        );

        if (foundTrackingsDoc) {
          const { trackingsPath } = foundTrackingsDoc;

          const isUpdated = await updateHydrationProgress(
            trackingsPath,
            newProgress
          );
        }
      }
    },
  });
}
