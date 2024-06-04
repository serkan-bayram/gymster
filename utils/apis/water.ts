import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../session-context";
import {
  findTrackingsDoc,
  getServerTime,
  updateHydrationProgress,
} from "../db";

export function useUpdateWater() {
  const { session } = useSession();

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

      if (serverTime && session) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
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
