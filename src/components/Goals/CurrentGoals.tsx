import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Goal } from "@/common/types";
import { Trash2 } from "lucide-react";

interface CurrentGoalsProps {
	goals: Goal[];
	onUpdateProgress: (id: string, newProgress: number) => void;
	onCompleteGoal: (id: string) => void;
	onDeleteGoal: (id: string) => void;
}

export default function CurrentGoals({
	goals,
	onUpdateProgress,
	onCompleteGoal,
	onDeleteGoal,
}: CurrentGoalsProps) {
	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle>Current Goals</CardTitle>
			</CardHeader>
			<CardContent>
				{goals.map((goal) => (
					<div key={goal.id} className="mb-4">
						<div className="flex justify-between items-center mb-2">
							<h3 className="font-semibold">{goal.target}</h3>
							<span className="text-sm text-muted-foreground">
								Deadline: {goal.deadline}
							</span>
						</div>
						<Progress value={goal.progress} className="mb-2" />
						<div className="flex justify-between items-center">
							<span className="text-sm">{goal.progress}% Complete</span>
							<div>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm" className="mr-2">
											Motivation
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Your Motivation</DialogTitle>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="bg-primary/10 p-4 rounded-lg">
												<p className="text-lg font-semibold mb-2">
													Remember Why You Started:
												</p>
												<p className="italic">
													{goal.motivation || "No motivation note provided"}
												</p>
											</div>
											<div className="bg-secondary/10 p-4 rounded-lg">
												<p className="text-lg font-semibold mb-2">Your Goal:</p>
												<p>{goal.target}</p>
											</div>
										</div>
										<div className="mt-4">
											<DialogTrigger asChild>
												<Button className="w-full">Let's Do This!</Button>
											</DialogTrigger>
										</div>
									</DialogContent>
								</Dialog>

								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										onUpdateProgress(goal.id, Math.min(goal.progress + 10, 100))
									}
								>
									Update Progress
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="ml-2"
									onClick={() => onCompleteGoal(goal.id)}
								>
									Mark as Complete
								</Button>
								<Button
									variant="destructive"
									className="ml-2"
									size="sm"
									onClick={() => onDeleteGoal(goal.id)}
								>
									<Trash2 className="mr-2 h-4 w-4" /> Delete
								</Button>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
