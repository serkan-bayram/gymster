import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { AppDispatch, store } from "./state/store";
import { setNotification } from "./state/notification/notificationSlice";

export function validateAge(age: number) {
  const Age = z
    .number({ message: "Geçersiz yaş, lütfen tekrar deneyin." })
    .int()
    .min(8, { message: "Yaşınız 8'den küçük olamaz." })
    .max(100, { message: "Yaşınız 100'den büyük olamaz." });

  const result = Age.safeParse(age);

  if (!result.success) {
    result.error.issues.map((error) =>
      store.dispatch(
        setNotification({
          show: true,
          text: { heading: "Hata", content: error.message },
          type: "error",
        })
      )
    );
    return false;
  }

  return result.data;
}

export function validateWeight(weight: number) {
  const Weight = z
    .number({ message: "Geçersiz kilo, lütfen tekrar deneyin." })
    .int()
    .min(20, { message: "Kilonuz 20'den küçük olamaz." })
    .max(500, { message: "Kilonuz 500'den büyük olamaz." });

  const result = Weight.safeParse(weight);

  if (!result.success) {
    result.error.issues.map((error) =>
      store.dispatch(
        setNotification({
          show: true,
          text: { heading: "Hata", content: error.message },
          type: "error",
        })
      )
    );
    return false;
  }

  return result.data;
}

export function validateGender(gender: string) {
  const Gender = z.string({
    message: "Geçersiz cinsiyet, lütfen tekrar deneyin.",
  });

  const result = Gender.safeParse(gender);

  if (!result.success) {
    result.error.issues.map((error) =>
      store.dispatch(
        setNotification({
          show: true,
          text: { heading: "Hata", content: error.message },
          type: "error",
        })
      )
    );
    return false;
  }

  return result.data;
}
