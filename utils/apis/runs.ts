import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Run, RunsDB } from "../types/runs";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { getRuns, saveRun, updateRuns } from "../db/runs";

// Get runs from DB
export function useGetRuns() {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    if (!user) return null;

    const runs = await getRuns(user.uid);

    if (runs && runs.length > 0) {
      return runs;
    }

    return null;
  };

  return useQuery({
    queryKey: ["getRuns"],
    queryFn: queryFn,
  });
}

// Updates runs with a documentPath
export function useUpdateRuns() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    documentPath,
    newRuns,
  }: {
    documentPath: string;
    newRuns: Run[];
  }) => {
    await updateRuns(documentPath, newRuns);

    return true;
  };

  return useMutation({
    mutationKey: ["deleteRun"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getRuns"] });
    },
    mutationFn: mutationFn,
  });
}

// Save runs to DB
export function useAddRuns() {
  const queryClient = useQueryClient();

  const mutationFn = async ({ runData }: { runData: RunsDB }) => {
    await saveRun(runData);
  };

  return useMutation({
    mutationKey: ["addRuns"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getRuns"],
      });
    },
    mutationFn: mutationFn,
  });
}
