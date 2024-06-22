import { z } from "zod";
import { store } from "../state/store";
import { setNotification } from "../state/notification/notificationSlice";

export function validateWeight(weight: number) {
  const Weight = z
    .number({ message: "Geçersiz ağırlık, lütfen tekrar deneyin." })
    .int()
    .min(0, { message: "Ağırlığınız 0'dan küçük olamaz." })
    .max(10000, { message: "Ağırlığınız 10000'den büyük olamaz." });

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

export function validateRepeat(repeat: number) {
  const Repeat = z
    .number({ message: "Geçersiz tekrar, lütfen tekrar deneyin." })
    .int()
    .min(0, { message: "Tekrar sayınız 0'dan küçük olamaz." })
    .max(10000, { message: "Tekrar sayınız 10000'den büyük olamaz." });

  const result = Repeat.safeParse(repeat);

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

export function validateComment(comment: string) {
  const Comment = z
    .string({
      message: "Geçersiz yorum, lütfen tekrar deneyin.",
    })
    .max(500, { message: "Yorumunuz 500 karakterden uzun olamaz." });

  const result = Comment.safeParse(comment);

  console.log(result);

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
