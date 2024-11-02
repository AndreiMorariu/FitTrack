import { Activity, Award, Dumbbell, Flame, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CompletedGoal, Workout } from "@/common/types";

interface WorkoutSummaryProps {
	workouts: Workout[];
	completedWorkouts: Workout[];
	completedGoals: CompletedGoal[];
}

const calculateMostFrequentExercise = (
	workouts: Workout[],
	completedWorkouts: Workout[]
): string | null => {
	const allWorkouts = [...workouts, ...completedWorkouts];

	const exerciseFrequency: Record<string, number> = {};

	allWorkouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			const exerciseName = exercise.name;

			if (exerciseFrequency[exerciseName]) {
				exerciseFrequency[exerciseName]++;
			} else {
				exerciseFrequency[exerciseName] = 1;
			}
		});
	});

	let mostFrequentExercise: string | null = null;
	let maxFrequency = 0;

	for (const [exerciseName, count] of Object.entries(exerciseFrequency)) {
		if (count > maxFrequency) {
			mostFrequentExercise = exerciseName;
			maxFrequency = count;
		}
	}

	return mostFrequentExercise;
};

const calculateActivityDays = (
	workouts: Workout[],
	completedWorkouts: Workout[]
): { mostActiveDay: string | null; leastActiveDay: string | null } => {
	const allWorkouts = [...workouts, ...completedWorkouts];

	const activityByDay: Record<string, number> = {
		Monday: 0,
		Tuesday: 0,
		Wednesday: 0,
		Thursday: 0,
		Friday: 0,
		Saturday: 0,
		Sunday: 0,
	};

	allWorkouts.forEach((workout) => {
		const workoutDate = new Date(workout.date);
		const dayOfWeek = workoutDate.toLocaleString("en-US", { weekday: "long" });

		activityByDay[dayOfWeek] += workout.duration;
	});

	let mostActiveDay: string | null = null;
	let leastActiveDay: string | null = null;
	let maxActivity = -Infinity;
	let minActivity = Infinity;

	for (const [day, totalDuration] of Object.entries(activityByDay)) {
		if (totalDuration > maxActivity) {
			mostActiveDay = day;
			maxActivity = totalDuration;
		}
		if (totalDuration < minActivity) {
			leastActiveDay = day;
			minActivity = totalDuration;
		}
	}

	return {
		mostActiveDay,
		leastActiveDay,
	};
};

const calculateMostFrequentType = (
	completedWorkouts: Workout[]
): string | null => {
	const typeFrequency: Record<string, number> = {};

	completedWorkouts.forEach((workout) => {
		const workoutType = workout.type;
		if (typeFrequency[workoutType]) {
			typeFrequency[workoutType]++;
		} else {
			typeFrequency[workoutType] = 1;
		}
	});

	let mostFrequentType: string | null = null;
	let maxFrequency = 0;

	for (const [type, count] of Object.entries(typeFrequency)) {
		if (count > maxFrequency) {
			mostFrequentType = type;
			maxFrequency = count;
		}
	}

	return mostFrequentType;
};

export default function WorkoutSummary({
	workouts,
	completedWorkouts,
	completedGoals,
}: WorkoutSummaryProps) {
	const totalCompletedWorkouts = completedWorkouts.length;
	const totalCompletedGoals = completedGoals.length;

	const totalWorkoutTime = completedWorkouts.reduce(
		(total, workout) => total + workout.duration,
		0
	);

	const averageWorkoutTime =
		completedWorkouts.length > 0
			? totalWorkoutTime / completedWorkouts.length
			: 0;

	const favoriteExercise = calculateMostFrequentExercise(
		workouts,
		completedWorkouts
	);

	const { mostActiveDay, leastActiveDay } = calculateActivityDays(
		workouts,
		completedWorkouts
	);

	const mostFrequentType = calculateMostFrequentType(completedWorkouts);

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Workout Time
					</CardTitle>
					<Flame className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalWorkoutTime} minutes</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Average Workout Time
					</CardTitle>
					<Activity className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{averageWorkoutTime.toFixed(1)} minutes
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Completed Workouts
					</CardTitle>
					<Dumbbell className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalCompletedWorkouts}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
					<Award className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalCompletedGoals}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Favorite Exercise
					</CardTitle>
					<Dumbbell className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{favoriteExercise || "N/A"}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Most Active Day</CardTitle>
					<Sun className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{mostActiveDay}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Least Active Day
					</CardTitle>
					<Moon className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{leastActiveDay}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Most Frequent Type Of Exercise
					</CardTitle>
					<Award className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{mostFrequentType || "N/A"}</div>
				</CardContent>
			</Card>
		</>
	);
}
