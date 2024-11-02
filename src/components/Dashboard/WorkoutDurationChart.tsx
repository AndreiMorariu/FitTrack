import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PieController,
	ArcElement,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from "chart.js";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Workout } from "@/common/types";

interface WorkoutDurationChartProps {
	completedWorkouts: Workout[];
}

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PieController,
	ArcElement,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

export default function WorkoutDurationChart({
	completedWorkouts,
}: WorkoutDurationChartProps) {
	const last30Days = [...Array(30)]
		.map((_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - i);
			return d.toISOString().split("T")[0];
		})
		.reverse();

	const avgDurationByType = completedWorkouts
		.filter((w) => new Date(w.date) >= new Date(last30Days[0]))
		.reduce((acc, w) => {
			acc[w.type] = acc[w.type] || { total: 0, count: 0 };
			acc[w.type].total += w.duration;
			acc[w.type].count += 1;
			return acc;
		}, {} as Record<string, { total: number; count: number }>);

	const avgDurationChartData = {
		labels: Object.keys(avgDurationByType),
		datasets: [
			{
				label: "Average Duration (minutes)",
				data: Object.values(avgDurationByType).map((v) => v.total / v.count),
				backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
			},
		],
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Average Workout Duration by Type</CardTitle>
			</CardHeader>
			<CardContent>
				<Bar data={avgDurationChartData} />
			</CardContent>
		</Card>
	);
}
