import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRuns, updateRuns } from "../db";
import { Run } from "../types";
import { useSession } from "../session-context";

// Get runs from DB
export function useGetRuns() {
  const { session } = useSession();

  return useQuery({
    queryKey: ["getRuns"],
    queryFn: async () => {
      if (session) {
        const runs = await getRuns(session.uid);

        if (runs && runs.length > 0) {
          return runs;
        }
      }

      return null;
    },
  });
}

// Updates runs with a documentPath
export function useUpdateRuns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRun"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getRuns"] });
    },
    mutationFn: async ({
      documentPath,
      newRuns,
    }: {
      documentPath: string;
      newRuns: Run[];
    }) => {
      await updateRuns(documentPath, newRuns);

      return true;
    },
  });
}
