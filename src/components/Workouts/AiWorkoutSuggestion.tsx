import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { generateWorkout } from "@/services/api";
import {
	Workout,
	Exercise,
	StrengthExercise,
	CardioExercise,
} from "@/common/types";

const formSchema = z.object({
	workoutType: z.enum(["cardio", "strength", "flexibility"]),
	muscleGroups: z.string().optional(),
	cardioMethod: z.string().optional(),
	preferredExercises: z.string(),
	environment: z.string(),
	numberOfExercises: z.number().min(1).max(20),
	duration: z.number().min(5).max(180),
});

function isStrengthExercise(exercise: Exercise): exercise is StrengthExercise {
	return "sets" in exercise && "reps" in exercise;
}

function isCardioExercise(exercise: Exercise): exercise is CardioExercise {
	return !("sets" in exercise) && !("reps" in exercise);
}

interface AIWorkoutSuggestionProps {
	onSaveWorkout: (workout: Workout) => void;
}

export default function AIWorkoutSuggestion({
	onSaveWorkout,
}: AIWorkoutSuggestionProps) {
	const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			workoutType: "cardio",
			muscleGroups: "",
			cardioMethod: "",
			preferredExercises: "",
			environment: "",
			numberOfExercises: 5,
			duration: 30,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const workout = await generateWorkout(values);
			setGeneratedWorkout(workout);
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error generating workout:", error);
			toast.error("Error generating workout, try again later");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveWorkout = () => {
		if (generatedWorkout) {
			onSaveWorkout(generatedWorkout);
			setIsModalOpen(false);
			setGeneratedWorkout(null);
		}
	};

	const handleGetAnotherSuggestion = () => {
		setIsModalOpen(false);
		form.handleSubmit(onSubmit)();
	};

	return (
		<div className="space-y-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="workoutType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Workout Type</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select workout type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="cardio">Cardio</SelectItem>
										<SelectItem value="strength">Strength</SelectItem>
										<SelectItem value="flexibility">Flexibility</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					{form.watch("workoutType") === "strength" && (
						<FormField
							control={form.control}
							name="muscleGroups"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Muscle Groups</FormLabel>
									<FormControl>
										<Input placeholder="e.g., chest, legs, back" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="preferredExercises"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Preferred Exercises</FormLabel>
								<FormControl>
									<Input placeholder="e.g., push-ups, squats" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="environment"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Preferred Environment</FormLabel>
								<FormControl>
									<Input placeholder="e.g., gym, home, outdoors" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="numberOfExercises"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Number of Exercises</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										onChange={(e) => field.onChange(parseInt(e.target.value))}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="duration"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Duration (minutes)</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										onChange={(e) => field.onChange(parseInt(e.target.value))}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Generating..." : "Get Workout Suggestion"}
					</Button>
				</form>
			</Form>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Generated Workout</DialogTitle>
					</DialogHeader>
					<ScrollArea className="mt-4 h-[60vh] pr-4">
						{generatedWorkout && (
							<div className="space-y-2">
								<p>
									<strong>Type:</strong> {generatedWorkout.type}
								</p>
								<p>
									<strong>Duration:</strong> {generatedWorkout.duration} minutes
								</p>
								<p>
									<strong>Exercises:</strong>
								</p>
								<ul className="list-disc pl-5">
									{generatedWorkout.exercises.map((exercise, index) => (
										<li key={index}>
											{exercise.name} - {exercise.duration} minutes
											{isStrengthExercise(exercise) && (
												<span>
													{" "}
													({exercise.sets} sets of {exercise.reps.join(", ")}{" "}
													reps)
												</span>
											)}
											{isCardioExercise(exercise) && <span> (Cardio)</span>}
										</li>
									))}
								</ul>
							</div>
						)}
					</ScrollArea>
					<DialogFooter className="sm:justify-start">
						<Button onClick={handleSaveWorkout}>Save Workout</Button>
						<Button variant="secondary" onClick={handleGetAnotherSuggestion}>
							Get Another Suggestion
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
