export interface Exercise {
  exerciseId: number;
  exercises: {
    comment: string;
    repeat: number;
    weight: number;
  }[];
}

export interface TodaysWorkoutsDB {
  todaysWorkouts: Exercise[];
  documentPath: string;
}

export interface DefaultExercise {
  id: number | string;
  name: string;
  type?: string;
  text?: string;
}

export interface DefaultExercises {
  exercises: DefaultExercise[];
}

export interface AddingWorkout {
  exerciseId: number | null;
  exercise: string | null;
  weight: number | null;
  repeat: number | null;
  comment: string | null;
}

export interface AllWorkouts {
  documentPath: string;
  date: {
    day: number;
    month: string;
    year: number;
  };
  workout: Exercise[];
}

export interface ExtraWorkout {
  id: string;
  name: string;
}
