import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate } from "@/utils/dates";

import {
	Workout,
	Exercise,
	StrengthExercise,
	CardioExercise,
} from "@/common/types";

const exerciseSchema = z.object({
	name: z.string().min(1, "Exercise name is required"),
	duration: z.number().min(1, "Duration is required"),
	sets: z.number().optional(),
	reps: z.array(z.number()).optional(),
	weights: z.array(z.number()).optional(),
});

const formSchema = z.object({
	date: z.date(),
	type: z.enum(["Cardio", "Strength", "Flexibility"]),
	exercises: z.array(exerciseSchema),
});

interface AddWorkoutProps {
	onAddWorkout: (workout: Workout) => void;
}

export default function AddWorkout({ onAddWorkout }: AddWorkoutProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			type: "Cardio",
			exercises: [{ name: "", duration: 0 }],
		},
	});

	const workoutType = form.watch("type");

	useEffect(() => {
		if (workoutType === "Strength") {
			form.setValue("exercises", [
				{ name: "", duration: 0, sets: 1, reps: [0], weights: [0] },
			]);
		} else {
			form.setValue("exercises", [{ name: "", duration: 0 }]);
		}
	}, [workoutType, form]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "exercises",
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		const totalDuration = values.exercises.reduce((total, exercise) => {
			return total + exercise.duration;
		}, 0);

		const newWorkout: Workout = {
			id: uuidv4(),
			date: formatDate(values.date, "yyyy-MM-dd"),
			type: values.type,
			duration: totalDuration,
			exercises: values.exercises.map((exercise): Exercise => {
				if (values.type === "Strength") {
					return {
						name: exercise.name,
						duration: exercise.duration,
						sets: exercise.sets!,
						reps: exercise.reps!,
						weights: exercise.weights!,
					} as StrengthExercise;
				} else {
					return {
						name: exercise.name,
						duration: exercise.duration,
					} as CardioExercise;
				}
			}),
		};

		onAddWorkout(newWorkout);

		form.reset({
			date: new Date(),
			type: "Cardio",
			exercises: [{ name: "", duration: 0 }],
		});
	};

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle className="px-2">Create Workout</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow overflow-hidden">
				<ScrollArea className="h-full pr-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4 px-2"
						>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-[240px] pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															formatDate(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Workout Type</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select workout type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Cardio">Cardio</SelectItem>
												<SelectItem value="Strength">Strength</SelectItem>
												<SelectItem value="Flexibility">Flexibility</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{fields.map((field, index) => (
								<div key={field.id} className="space-y-2 border-b pb-4 mb-4">
									<FormField
										control={form.control}
										name={`exercises.${index}.name`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Exercise Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`exercises.${index}.duration`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Duration (minutes)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{workoutType === "Strength" && (
										<>
											<FormField
												control={form.control}
												name={`exercises.${index}.sets`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Sets</FormLabel>
														<FormControl>
															<Input
																type="number"
																{...field}
																onChange={(e) => {
																	const sets = parseInt(e.target.value);
																	field.onChange(sets);
																	const currentReps =
																		form.getValues(`exercises.${index}.reps`) ||
																		[];
																	const currentWeights =
																		form.getValues(
																			`exercises.${index}.weights`
																		) || [];
																	form.setValue(
																		`exercises.${index}.reps`,
																		Array(sets)
																			.fill(0)
																			.map((_, i) => currentReps[i] || 0)
																	);
																	form.setValue(
																		`exercises.${index}.weights`,
																		Array(sets)
																			.fill(0)
																			.map((_, i) => currentWeights[i] || 0)
																	);
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`exercises.${index}.reps`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Reps and Weights per Set</FormLabel>
														<FormControl>
															<div className="space-y-2">
																{Array.from({
																	length:
																		form.getValues(`exercises.${index}.sets`) ||
																		0,
																}).map((_, setIndex) => (
																	<div
																		key={setIndex}
																		className="flex items-center space-x-2"
																	>
																		<span>{setIndex + 1}:</span>
																		<Input
																			type="number"
																			placeholder="Reps"
																			value={field.value?.[setIndex] || 0}
																			onChange={(e) => {
																				const newReps = [
																					...(field.value || []),
																				];
																				newReps[setIndex] = parseInt(
																					e.target.value
																				);
																				field.onChange(newReps);
																			}}
																		/>
																		<Input
																			type="number"
																			placeholder="Weight"
																			value={
																				form.watch(
																					`exercises.${index}.weights.${setIndex}`
																				) || 0
																			}
																			onChange={(e) => {
																				const currentWeights =
																					form.getValues(
																						`exercises.${index}.weights`
																					) || [];
																				const newWeights = [...currentWeights];
																				newWeights[setIndex] =
																					parseFloat(e.target.value) || 0;
																				form.setValue(
																					`exercises.${index}.weights`,
																					newWeights,
																					{
																						shouldValidate: true,
																					}
																				);
																			}}
																		/>
																	</div>
																))}
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									)}
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => remove(index)}
									>
										<Minus className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2"
								onClick={() =>
									append(
										workoutType === "Strength"
											? {
													name: "",
													duration: 0,
													sets: 1,
													reps: [0],
													weights: [0],
											  }
											: { name: "", duration: 0 }
									)
								}
							>
								<Plus className="mr-2 h-4 w-4" /> Add Exercise
							</Button>
							<Button type="submit" className="w-full">
								Save Workout
							</Button>
						</form>
					</Form>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
