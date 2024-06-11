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
  exerciseId: number | null;
  exercise: string | null;
  weight: number | null;
  repeat: number | null;
}

export interface WorkoutDB {
  exerciseId: number;
  exercise: string;
  weight: number;
  repeat: number;
}

export interface DefaultExercise {
  id: number;
  name: string;
}

export interface DefaultExercises {
  exercises: DefaultExercise[];
}
