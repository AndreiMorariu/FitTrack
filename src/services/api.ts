import Groq from "groq-sdk";
import { v4 as uuidv4 } from "uuid";

import {
	Workout,
	Exercise,
	StrengthExercise,
	CardioExercise,
	GeneratedExercise,
	GeneratedWorkout,
} from "@/common/types";

const groq = new Groq({
	apiKey: import.meta.env.VITE_KEY,
	dangerouslyAllowBrowser: true,
});

const workoutSchema = {
	type: "object",
	properties: {
		type: { type: "string", enum: ["Cardio", "Strength", "Flexibility"] },
		duration: { type: "number" },
		exercises: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					duration: { type: "number" },
					sets: { type: "number", optional: true },
					reps: {
						type: "array",
						items: { type: "number" },
						optional: true,
					},
				},
				required: ["name", "duration"],
			},
		},
	},
	required: ["type", "duration", "exercises"],
};

export async function generateWorkout(userInput: {
	workoutType: string;
	muscleGroups?: string;
	cardioMethod?: string;
	preferredExercises: string;
	environment: string;
	numberOfExercises: number;
	duration: number;
}): Promise<Workout> {
	const content = `
    Generate a workout plan based on the following user input, ensure that the total duration of all exercises matches the requested duration, and that the number of exercises matches the requested number and aim for 2 exercies per muscle group, make sure to include a realistic weight for each set based on the exercise:
    - Workout Type: ${userInput.workoutType}
    ${
			userInput.muscleGroups ? `- Muscle Groups: ${userInput.muscleGroups}` : ""
		}
    ${
			userInput.cardioMethod ? `- Cardio Method: ${userInput.cardioMethod}` : ""
		}
    - Preferred Exercises: ${userInput.preferredExercises}
    - Environment: ${userInput.environment}
    - Number of Exercises: ${userInput.numberOfExercises}
    - Duration: ${userInput.duration} minutes

    Create a workout plan that fits these criteria. The response should be a JSON object that matches the following schema:
    ${JSON.stringify(workoutSchema, null, 2)}.
  `;

	const completion = await groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content,
			},
		],
		model: "mixtral-8x7b-32768",
		temperature: 0.5,
		max_tokens: 1000,
		stream: false,
		response_format: { type: "json_object" },
	});

	const responseContent = completion.choices[0].message.content;

	if (!responseContent) {
		throw new Error("Failed to generate workout: Empty response");
	}

	const generatedWorkout: GeneratedWorkout = JSON.parse(responseContent);

	const workout: Workout = {
		id: uuidv4(),
		date: new Date().toISOString().split("T")[0],
		type: generatedWorkout.type,
		duration: generatedWorkout.duration,
		exercises: generatedWorkout.exercises.map(
			(exercise: GeneratedExercise): Exercise => {
				if (exercise.sets !== undefined && exercise.reps !== undefined) {
					return {
						name: exercise.name,
						duration: exercise.duration,
						sets: exercise.sets,
						reps: exercise.reps,
						weights: exercise.weights || [],
					} as StrengthExercise;
				} else {
					return {
						name: exercise.name,
						duration: exercise.duration,
					} as CardioExercise;
				}
			}
		),
	};

	return workout;
}

const suggestionsSchema = {
	type: "object",
	properties: {
		recommendations: {
			type: "array",
			items: { type: "number" },
			optional: false,
			length: 5,
		},
		required: ["recommendations"],
	},
};

export async function generateSuggestions(trainingData: string, goals: string) {
	const content = `Generate insights and recommendations based on the user's training data and formulate the response as if you were talking to the user. For example, in strength training the latest studies have shown that training each muscle group twice per week is beneficial. The user's training data, if the input for some things is empty just ignore that part and do not request more information: \n${trainingData}\nUser goals: ${goals}

  The response should be a JSON object that matches the following schema:
  ${JSON.stringify(suggestionsSchema, null, 2)}.
  `;

	const completion = await groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content,
			},
		],
		model: "mixtral-8x7b-32768",
		temperature: 0.5,
		max_tokens: 1000,
		stream: false,
		response_format: { type: "json_object" },
	});

	const responseContent = completion.choices[0].message.content;

	if (!responseContent) {
		throw new Error("Failed to generate suggestions: Empty response");
	}

	return JSON.parse(responseContent);
}
