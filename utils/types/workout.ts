export interface Exercise {
  exerciseId: number;
  exercises: {
    repeat: number;
    weight: number;
  }[];
}

export interface TodaysWorkoutsDB {
  todaysWorkouts: Exercise[];
  documentPath: string;
}

export interface DefaultExercise {
  id: number;
  name: string;
}

export interface DefaultExercises {
  exercises: DefaultExercise[];
}
