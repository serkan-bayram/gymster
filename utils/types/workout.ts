export interface TotalSet {
  setCount: number;
  repeat: number;
}

export interface ExerciseType {
  exercise: string;
  set: TotalSet;
}

export interface SetType {
  setIndex: number;
  weight: number;
  repeat: number;
}

export interface AddingWorkout {
  exercise: string | null;
  weight: string | null;
  repeat: string | null;
}
