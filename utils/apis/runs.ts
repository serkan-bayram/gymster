import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRuns, saveRun, updateRuns } from "../db";
import { useSession } from "../session-context";
import { Run, RunsDB } from "../types/runs";

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

// Save runs to DB
export function useAddRuns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addRuns"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getRuns"],
      });
    },
    mutationFn: async ({ runData }: { runData: RunsDB }) =>
      await saveRun(runData),
  });
}
