import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PersonStanding } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Workout, Goal } from "@/common/types";

import { generateSuggestions } from "@/services/api";

interface InsightsAndRecommendationsProps {
	completedWorkouts: Workout[];
	goals: Goal[];
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function InsightsAndRecommendations({
	completedWorkouts,
	goals,
}: InsightsAndRecommendationsProps) {
	const [recommendations, setRecommendations] = useState<string[]>(() => {
		const localData = localStorage.getItem("recommendations");

		if (localData) {
			try {
				const parsedData = JSON.parse(localData);
				const { savedAt, recommendations } = parsedData;

				if (Date.now() - savedAt < ONE_DAY_IN_MS) {
					return recommendations;
				} else {
					localStorage.removeItem("recommendations");
				}
			} catch (error) {
				console.log(error);
			}
		}

		return [];
	});

	const totalWorkoutTime = completedWorkouts.reduce(
		(total, workout) => total + workout.duration,
		0
	);

	const averageWorkoutTime =
		completedWorkouts.length > 0
			? totalWorkoutTime / completedWorkouts.length
			: 0;

	const calculateWorkoutTypesCount = (
		completedWorkouts: Workout[]
	): Record<string, number> => {
		const workoutTypesCount = completedWorkouts.reduce(
			(acc: Record<string, number>, workout: Workout) => {
				acc[workout.type] = (acc[workout.type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return workoutTypesCount;
	};

	useEffect(() => {
		if (recommendations.length > 0) {
			const dataToSave = {
				savedAt: Date.now(),
				recommendations,
			};
			localStorage.setItem("recommendations", JSON.stringify(dataToSave));
		}
	}, [recommendations]);

	useEffect(() => {
		if (completedWorkouts.length === 0) return;
		if (recommendations.length > 0) return;

		async function getSuggestions() {
			try {
				const response = await generateSuggestions(
					JSON.stringify(
						`Average workout time: ${averageWorkoutTime}. Total workout time: ${totalWorkoutTime}. Workouts by type: ${calculateWorkoutTypesCount(
							completedWorkouts
						)}`
					),
					JSON.stringify(goals)
				);

				setRecommendations(response.recommendations);
			} catch (error) {
				console.log(error);
				toast.error("Could not generate recommendations");
			}
		}

		getSuggestions();
	}, [
		completedWorkouts,
		goals,
		averageWorkoutTime,
		totalWorkoutTime,
		recommendations.length,
	]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>AI Insights & Recommendations</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				{recommendations.map((recommendation, index) => (
					<div
						key={index}
						className="flex items-start space-x-4 p-4 rounded-lg bg-secondary"
					>
						<PersonStanding className="w-6 h-6 text-primary" />
						<p className="text-sm">{recommendation}</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
