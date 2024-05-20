import { Alert } from "react-native";
import { z } from "zod";

export function validateAge(age: string) {
  const Age = z
    .number({ message: "Geçersiz yaş, lütfen tekrar deneyin." })
    .int()
    .min(8, { message: "Yaşınız 8'den küçük olamaz." })
    .max(100, { message: "Yaşınız 100'den büyük olamaz." });

  const result = Age.safeParse(parseInt(age));

  if (!result.success) {
    result.error.issues.map((error) => Alert.alert("Hata", error.message));
    return false;
  }

  return true;
}

export function validateWeight(weight: string) {
  const Weight = z
    .number({ message: "Geçersiz kilo, lütfen tekrar deneyin." })
    .int()
    .min(20, { message: "Kilonuz 20'den küçük olamaz." })
    .max(500, { message: "Kilonuz 500'den büyük olamaz." });

  const result = Weight.safeParse(parseFloat(weight));

  if (!result.success) {
    result.error.issues.map((error) => Alert.alert("Hata", error.message));
    return false;
  }

  return true;
}

export function validateGender(gender: string) {
  const Gender = z.string({
    message: "Geçersiz cinsiyet, lütfen tekrar deneyin.",
  });

  const result = Gender.safeParse(gender);

  if (!result.success) {
    result.error.issues.map((error) => Alert.alert("Hata", error.message));
    return false;
  }

  return true;
}