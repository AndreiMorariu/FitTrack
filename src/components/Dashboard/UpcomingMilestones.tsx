import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

import { formatDate } from "@/utils/dates";

import { Goal } from "@/common/types";

interface UpcomingMilestonesProps {
	goals: Goal[];
}

export default function UpcomingMilestones({ goals }: UpcomingMilestonesProps) {
	const upcomingMilestones = goals
		.filter((g) => new Date(g.deadline) > new Date())
		.map((g) => ({
			...g,
			daysRemaining: Math.ceil(
				(new Date(g.deadline).getTime() - new Date().getTime()) /
					(1000 * 60 * 60 * 24)
			),
		}))
		.sort((a, b) => a.daysRemaining - b.daysRemaining);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">Upcoming Milestones</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[340px] pr-4">
					{upcomingMilestones.length > 0 ? (
						<div className="space-y-4">
							{upcomingMilestones.map((goal, index) => (
								<div
									key={index}
									className={`flex items-center justify-between p-3 rounded-lg ${
										goal.daysRemaining <= 7
											? "bg-red-100 dark:bg-red-900"
											: "bg-secondary"
									}`}
								>
									<div>
										<p className="font-semibold">
											{goal.type}: {goal.target}
										</p>
										<p className="text-sm text-muted-foreground">
											Deadline: {formatDate(new Date(goal.deadline), "PPP")}
										</p>
									</div>
									<div
										className={`text-right ${
											goal.daysRemaining <= 7
												? "text-red-600 dark:text-red-400"
												: ""
										}`}
									>
										<p className="text-2xl font-bold">{goal.daysRemaining}</p>
										<p className="text-xs">days left</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-center text-muted-foreground">
							No upcoming milestones
						</p>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
