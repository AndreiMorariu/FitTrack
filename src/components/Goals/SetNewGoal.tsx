import { Calendar as CalendarIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { formatDate } from "@/utils/dates";

const formSchema = z.object({
	type: z.enum(["Weight Loss", "Endurance", "Strength"]),
	target: z.string().min(1, "Target is required"),
	deadline: z.date(),
	motivation: z.string().optional(),
});

interface SetNewGoalProps {
	onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export default function SetNewGoal({ onSubmit }: SetNewGoalProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "Weight Loss",
			target: "",
			deadline: new Date(),
			motivation: "",
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit(values);
		form.reset();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Set New Goal</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Goal Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select goal type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Weight Loss">Weight Loss</SelectItem>
											<SelectItem value="Endurance">Endurance</SelectItem>
											<SelectItem value="Strength">Strength</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="target"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Target Metric</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., Run 5 miles, Lose 5 lbs"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="deadline"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Deadline</FormLabel>
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
												disabled={(date) => date < new Date()}
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
							name="motivation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Motivation Note (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="What motivates you to achieve this goal?"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Create Goal</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
