export type BaseExercise = {
	name: string;
	duration: number;
};

export type CardioExercise = BaseExercise;

export type StrengthExercise = BaseExercise & {
	sets: number;
	reps: number[];
	weights: number[];
};

export type Exercise = CardioExercise | StrengthExercise;

export type Workout = {
	id: string;
	date: string;
	type: string;
	duration: number;
	exercises: Exercise[];
};

export interface Goal {
	id: string;
	type: string;
	target: string;
	deadline: string;
	progress: number;
	motivation: string;
}

export interface CompletedGoal {
	id: string;
	type: string;
	target: string;
	completedDate: string;
	motivation: string;
}

export type GeneratedExercise = {
	name: string;
	duration: number;
	sets?: number;
	reps?: number[];
	weights?: number[];
};

export type GeneratedWorkout = {
	type: "Cardio" | "Strength" | "Flexibility";
	duration: number;
	exercises: GeneratedExercise[];
};
