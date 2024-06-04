import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../session-context";
import {
  findTrackingsDoc,
  getAllMeals,
  getServerTime,
  updateMeals,
} from "../db";
import { DateObject, Meal, MealsDetailsObject, Sums } from "../types/meals";

// Gets all meals
export function useGetMeals({
  setCurrentMeal,
  setMeals,
}: {
  setCurrentMeal: (currentMeal: MealsDetailsObject) => void;
  setMeals: (mealsArray: DateObject[]) => void;
}) {
  const { session } = useSession();

  return useQuery({
    queryKey: ["mealsDetails"],
    queryFn: async () => {
      if (!session) {
        return null;
      }

      const meals = await getAllMeals(session.uid);

      if (meals) {
        const mealsArray: DateObject[] = [];

        // Sort meals
        meals.sort((a, b) => {
          return b.createdAt.toDate() - a.createdAt.toDate();
        });

        // Get useful information from meals and put in mealsArray
        meals.forEach((meal) => {
          const options = { month: "long", day: "numeric" } as const;

          const date = new Date(meal.createdAt.toDate());
          const day = date.toLocaleDateString("tr-TR", options);
          const year = date.getFullYear();

          const sums: Sums = {
            carbs: 0,
            protein: 0,
            fat: 0,
            kcal: 0,
          };

          meal.meals.forEach((meal: Meal) => {
            const nutritions = meal?.nutritions;

            sums.carbs += parseFloat(nutritions?.carbs);
            sums.protein += parseFloat(nutritions?.protein);
            sums.fat += parseFloat(nutritions?.fat);
            sums.kcal += parseFloat(nutritions?.kcal);
          });

          // what has eaten in which date in which year
          const dateObject: DateObject = {
            day: day,
            year: year,
            meals: meal.meals,
            sums: sums,
          };

          mealsArray.push(dateObject);
        });

        // We show this on first mount
        const currentMeal: MealsDetailsObject = {
          day: mealsArray[0].day,
          sums: mealsArray[0].sums,
        };

        setCurrentMeal(currentMeal);
        setMeals(mealsArray);

        return meals;
      }

      return null;
    },
  });
}

export function useUpdateMeals() {
  const { session } = useSession();

  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tracking", "mealsDetails"],
      });
    },
    mutationFn: async (newMeal: any) => {
      // Upddate & get server time
      const serverTime = await getServerTime();

      if (serverTime && session) {
        const foundTrackingsDoc = await findTrackingsDoc(
          session.uid,
          serverTime.date
        );

        // Remove empty {} at first index
        const shifted = [...newMeal];
        shifted.shift();

        if (foundTrackingsDoc) {
          const { trackingsPath } = foundTrackingsDoc;

          const isUpdated = await updateMeals(trackingsPath, shifted);
        }
      }
    },
  });
}
