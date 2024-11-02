import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/ui/Navbar";
import AIWorkoutSuggestion from "@/components/Workouts/AiWorkoutSuggestion";
import AddWorkout from "@/components/Workouts/AddWorkout";
import WorkoutLog from "@/components/Workouts/WorkoutLog";
import UserWorkouts from "@/components/Workouts/UserWorkouts";

import { Workout } from "@/common/types";

export default function Workouts() {
	const [workouts, setWorkouts] = useState<Workout[]>(() => {
		const localData = localStorage.getItem("workouts");
		return localData ? JSON.parse(localData) : [];
	});
	const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>(() => {
		const localData = localStorage.getItem("completedWorkouts");
		return localData ? JSON.parse(localData) : [];
	});

	useEffect(() => {
		localStorage.setItem("workouts", JSON.stringify(workouts));
	}, [workouts]);

	useEffect(() => {
		localStorage.setItem(
			"completedWorkouts",
			JSON.stringify(completedWorkouts)
		);
	}, [completedWorkouts]);

	const handleAddWorkout = (newWorkout: Workout) => {
		setWorkouts([...workouts, newWorkout]);
		toast.success("Workout added to your workouts");
	};

	const handleRemoveWorkout = (id: string) => {
		setWorkouts(workouts.filter((w) => w.id !== id));
		toast.success("Workout removed from your workouts");
	};

	const handleAddCompleteWorkout = (workout: Workout) => {
		const completedWorkout = {
			...workout,
			id: uuidv4(),
			date: new Date().toISOString().split("T")[0],
		};

		setCompletedWorkouts([completedWorkout, ...completedWorkouts]);
		toast.success("Workout added to your log");
	};

	const handleRemoveCompletedWorkout = (id: string) => {
		setCompletedWorkouts(completedWorkouts.filter((w) => w.id !== id));
		toast.success("Workout removed from your log");
	};

	return (
		<div className="container mx-auto p-4 xl:p-10 overflow-x-hidden">
			<Navbar />
			<div className="grid gap-6 md:grid-cols-2">
				<AddWorkout onAddWorkout={handleAddWorkout} />
				<Card>
					<CardHeader>
						<CardTitle>AI Workout Suggestion</CardTitle>
					</CardHeader>
					<CardContent>
						<AIWorkoutSuggestion onSaveWorkout={handleAddWorkout} />
					</CardContent>
				</Card>
			</div>
			<UserWorkouts
				workouts={workouts}
				onRemoveWorkout={handleRemoveWorkout}
				onCompleteWorkout={handleAddCompleteWorkout}
			/>
			<WorkoutLog
				completedWorkouts={completedWorkouts}
				onRemoveWorkout={handleRemoveCompletedWorkout}
			/>
		</div>
	);
}
