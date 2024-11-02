import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	Workout,
	Exercise,
	CardioExercise,
	StrengthExercise,
} from "@/common/types";

interface UserWorkoutsProps {
	workouts: Workout[];
	onRemoveWorkout: (id: string) => void;
	onCompleteWorkout: (workout: Workout) => void;
}

function isStrengthExercise(exercise: Exercise): exercise is StrengthExercise {
	return "sets" in exercise && "reps" in exercise && "weights" in exercise;
}

function isCardioExercise(exercise: Exercise): exercise is CardioExercise {
	return "duration" in exercise;
}

export default function UserWorkouts({
	workouts,
	onRemoveWorkout,
	onCompleteWorkout,
}: UserWorkoutsProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"date" | "duration">("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [filterType, setFilterType] = useState<string | null>(null);
	const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

	const handleFilterChange = (value: string) => {
		setFilterType(value === "all" ? null : value);
	};

	const handleSort = (key: "date" | "duration") => {
		if (sortBy === key) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(key);
			setSortOrder("asc");
		}
	};

	const sortedAndFilteredWorkouts = workouts
		.filter(
			(workout) =>
				(filterType ? workout.type === filterType : true) &&
				(workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
					workout.date.includes(searchTerm))
		)
		.sort((a, b) => {
			if (sortBy === "date") {
				return sortOrder === "asc"
					? a.date.localeCompare(b.date)
					: b.date.localeCompare(a.date);
			} else {
				return sortOrder === "asc"
					? a.duration - b.duration
					: b.duration - a.duration;
			}
		});

	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle>Your Workouts</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4 space-y-4">
					<Input
						type="text"
						placeholder="Search workouts..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className="flex justify-between items-center">
						<Select
							value={filterType || "all"}
							onValueChange={handleFilterChange}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="Cardio">Cardio</SelectItem>
								<SelectItem value="Strength">Strength</SelectItem>
								<SelectItem value="Flexibility">Flexibility</SelectItem>
							</SelectContent>
						</Select>
						<div className="space-x-2 flex items-center gap-2">
							<p>Sort by</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSort("date")}
							>
								Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSort("duration")}
							>
								Duration{" "}
								{sortBy === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
							</Button>
						</div>
					</div>
				</div>
				<Carousel className="w-full">
					<CarouselContent>
						{sortedAndFilteredWorkouts.map((workout) => (
							<CarouselItem
								key={workout.id}
								className="md:basis-1/2 lg:basis-1/3"
							>
								<Card>
									<CardHeader>
										<CardTitle>{workout.type} Workout</CardTitle>
									</CardHeader>
									<CardContent>
										<p>
											<strong>Created Date:</strong> {workout.date}
										</p>
										<p>
											<strong>Duration:</strong> {workout.duration} minutes
										</p>
										<p>
											<strong>Exercises:</strong> {workout.exercises.length}
										</p>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setSelectedWorkout(workout)}
										>
											<Eye className="mr-2 h-4 w-4" /> View
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => onRemoveWorkout(workout.id)}
										>
											<Trash2 className="mr-2 h-4 w-4" /> Delete
										</Button>
									</CardFooter>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</CardContent>

			<Dialog
				open={!!selectedWorkout}
				onOpenChange={() => setSelectedWorkout(null)}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{selectedWorkout?.type} Workout</DialogTitle>
					</DialogHeader>
					<ScrollArea className="mt-4 h-[60vh] pr-4">
						{selectedWorkout && (
							<div className="space-y-4">
								<p>
									<strong>Created Date:</strong> {selectedWorkout.date}
								</p>
								<p>
									<strong>Duration:</strong> {selectedWorkout.duration} minutes
								</p>
								<p>
									<strong>Exercises:</strong>
								</p>
								<ul className="list-disc list-inside space-y-2">
									{selectedWorkout.exercises.map((exercise, index) => (
										<li key={index}>
											<strong>{exercise.name}</strong>
											{isStrengthExercise(exercise) ? (
												<ul className="list-disc list-inside ml-4">
													{exercise.sets > 0 &&
														Array.from({ length: exercise.sets }).map(
															(_, setIndex) => (
																<li key={setIndex}>
																	Set {setIndex + 1}:{" "}
																	{exercise.reps[setIndex] || 0} reps
																</li>
															)
														)}
												</ul>
											) : isCardioExercise(exercise) ? (
												<span> ({exercise.duration} minutes)</span>
											) : null}
										</li>
									))}
								</ul>
							</div>
						)}
					</ScrollArea>
					<DialogFooter>
						<Button
							onClick={() => {
								if (selectedWorkout) {
									onCompleteWorkout(selectedWorkout);
									setSelectedWorkout(null);
								}
							}}
						>
							Complete Workout
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
