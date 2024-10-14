import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { CompletedGoal } from "@/common/types";
import { Trash2 } from "lucide-react";

interface CompletedGoalsProps {
	goals: CompletedGoal[];
	onReattemptGoal: (id: string) => void;
	onDeleteGoal: (id: string) => void;
}

export default function CompletedGoals({
	goals,
	onReattemptGoal,
	onDeleteGoal,
}: CompletedGoalsProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Collapsible className="mt-6">
			<Card>
				<CardHeader>
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							className="w-full justify-between"
							onClick={() => setIsOpen(!isOpen)}
						>
							Completed Goals
							<span>{isOpen ? "▲" : "▼"}</span>
						</Button>
					</CollapsibleTrigger>
				</CardHeader>
				<CollapsibleContent>
					<CardContent>
						{goals.map((goal) => (
							<div
								key={goal.id}
								className="mb-4 flex justify-between items-center"
							>
								<div>
									<h3 className="font-semibold">{goal.target}</h3>
									<span className="text-sm text-muted-foreground">
										Completed on: {goal.completedDate}
									</span>
								</div>
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
													<p className="text-lg font-semibold mb-2">
														Your Completed Goal:
													</p>
													<p>{goal.target}</p>
												</div>
											</div>
											<div className="mt-4">
												<DialogTrigger asChild>
													<Button className="w-full">Close</Button>
												</DialogTrigger>
											</div>
										</DialogContent>
									</Dialog>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onReattemptGoal(goal.id)}
									>
										Reattempt
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
						))}
					</CardContent>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
}
