import { useState } from "react";

import Navbar from "@/components/ui/Navbar";
import WorkoutSummary from "@/components/Dashboard/WorkoutSummary";
import WorkoutDurationChart from "@/components/Dashboard/WorkoutDurationChart";
import UpcomingMilestones from "@/components/Dashboard/UpcomingMilestones";
import InsightsAndRecommendations from "@/components/Dashboard/InsightsAndRecommendations";

import { Workout, Goal, CompletedGoal } from "@/common/types";

export default function Dashboard() {
	const [workouts] = useState<Workout[]>(() => {
		const localData = localStorage.getItem("workouts");
		return localData ? JSON.parse(localData) : [];
	});
	const [completedWorkouts] = useState<Workout[]>(() => {
		const localData = localStorage.getItem("completedWorkouts");
		return localData ? JSON.parse(localData) : [];
	});
	const [goals] = useState<Goal[]>(() => {
		const localData = localStorage.getItem("goals");
		return localData ? JSON.parse(localData) : [];
	});
	const [completedGoals] = useState<CompletedGoal[]>(() => {
		const localData = localStorage.getItem("completedGoals");
		return localData ? JSON.parse(localData) : [];
	});

	return (
		<div className="container mx-auto p-4 xl:p-10 overflow-x-hidden">
			<Navbar />
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
				<WorkoutSummary
					workouts={workouts}
					completedGoals={completedGoals}
					completedWorkouts={completedWorkouts}
				/>
			</div>
			<div className="grid gap-6 md:grid-cols-2 mb-6">
				<WorkoutDurationChart completedWorkouts={completedWorkouts} />
				<UpcomingMilestones goals={goals} />
			</div>
			<InsightsAndRecommendations
				completedWorkouts={completedWorkouts}
				goals={goals}
			/>
		</div>
	);
}
