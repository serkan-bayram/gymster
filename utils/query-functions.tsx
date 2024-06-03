import { getRuns } from "./db";

export const queryGetRuns = async (uid: string | undefined) => {
  if (uid) {
    const runs = await getRuns(uid);

    if (runs) {
      return runs;
    }
  }

  return null;
};
