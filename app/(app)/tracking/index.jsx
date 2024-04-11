import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";
import { WaterProvider } from "@/utils/water-context";
import { PrimaryButton } from "@/components/primary-button";
import { useSession } from "@/utils/session-context";

// TODO: tidy up colors
export default function Tracking() {
  return (
    <>
      <Heading heading={"Tracking"} />
      <GYMDays />
      <Meals />
      <WaterProvider>
        <Water />
      </WaterProvider>
    </>
  );
}
