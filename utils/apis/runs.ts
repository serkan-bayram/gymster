import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRuns, saveRun, updateRuns } from "../db";
import { Run, RunsDB } from "../types/runs";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

// Get runs from DB
export function useGetRuns() {
  const user = useSelector((state: RootState) => state.session.user);

  return useQuery({
    queryKey: ["getRuns"],
    queryFn: async () => {
      if (user) {
        const runs = await getRuns(user.uid);

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
