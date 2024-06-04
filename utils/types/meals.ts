export interface Sums {
  carbs: number;
  protein: number;
  fat: number;
  kcal: number;
}

export interface DateObject {
  day: string;
  year: number;
  meals: Meal;
  sums: Sums;
}

export interface MealsDetailsObject {
  y?: number;
  day: string;
  sums: Sums;
}

export interface Nutritions {
  carbs: string;
  fat: string;
  kcal: string;
  protein: string;
}

export interface Meal {
  nutritions: Nutritions;
  userInput: string;
}
