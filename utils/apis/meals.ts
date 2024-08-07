import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServerTime } from "../db";
import { DateObject, Meal, MealsDetailsObject, Sums } from "../types/meals";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { getAllMeals, updateMeals } from "../db/meals";
import { findTrackingsDoc } from "../db/tracking";
import { setNotification } from "../state/notification/notificationSlice";

// Gets all meals
export function useGetMeals({
  setCurrentMeal,
  setMeals,
}: {
  setCurrentMeal: (currentMeal: MealsDetailsObject) => void;
  setMeals: (mealsArray: DateObject[]) => void;
}) {
  const user = useSelector((state: RootState) => state.session.user);

  const queryFn = async () => {
    if (!user) {
      return null;
    }

    const meals = await getAllMeals(user.uid);

    if (meals && meals.length > 0) {
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

    return [];
  };

  return useQuery({
    queryKey: ["mealsDetails"],
    queryFn: queryFn,
  });
}

export function useUpdateMeals() {
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch<AppDispatch>();

  const queryClient = useQueryClient();

  const mutationFn = async (newMeal: any) => {
    if (!user) return null;

    const foundTrackingsDoc = await findTrackingsDoc(user.uid);

    if (!foundTrackingsDoc) return null;

    // Remove empty {} at first index
    const shifted = [...newMeal];
    shifted.shift();

    const { trackingsPath } = foundTrackingsDoc;

    const isUpdated = await updateMeals(trackingsPath, shifted);

    if (!isUpdated) {
      dispatch(
        setNotification({
          show: true,
          text: {
            heading: "Hata",
            content: "Öğün eklenemedi, daha sonra tekrar deneyiniz.",
          },
          type: "error",
        })
      );
      return null;
    }

    dispatch(
      setNotification({
        show: true,
        text: {
          heading: "Başarılı",
          content: "Öğün başarıyla eklendi!",
        },
        type: "success",
      })
    );

    return true;
  };

  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tracking", "mealsDetails"],
      });
    },
    mutationFn: mutationFn,
  });
}
