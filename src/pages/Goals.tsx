import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import Navbar from "@/components/ui/Navbar";
import SetNewGoal from "@/components/Goals/SetNewGoal";
import CurrentGoals from "@/components/Goals/CurrentGoals";
import CompletedGoals from "@/components/Goals/CompletedGoals";

import { formatDate } from "@/utils/dates";

import { Goal, CompletedGoal } from "@/common/types";

export default function Goals() {
	const [currentGoals, setCurrentGoals] = useState<Goal[]>(() => {
		const localData = localStorage.getItem("goals");
		return localData ? JSON.parse(localData) : [];
	});
	const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>(() => {
		const localData = localStorage.getItem("completedGoals");
		return localData ? JSON.parse(localData) : [];
	});
	const [isConfetti, setIsConfetti] = useState(false);

	const { width, height } = useWindowSize();

	useEffect(() => {
		if (isConfetti) {
			const timer = setTimeout(() => {
				setIsConfetti(false);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [isConfetti]);

	useEffect(() => {
		localStorage.setItem("goals", JSON.stringify(currentGoals));
	}, [currentGoals]);

	useEffect(() => {
		localStorage.setItem("completedGoals", JSON.stringify(completedGoals));
	}, [completedGoals]);

	const onSubmitNewGoal = (values: {
		type: "Weight Loss" | "Endurance" | "Strength";
		target: string;
		deadline: Date;
		motivation?: string;
	}) => {
		const newGoal = {
			id: uuidv4(),
			type: values.type,
			target: values.target,
			deadline: formatDate(new Date(values.deadline), "yyyy-MM-dd"),
			progress: 0,
			motivation: values.motivation || "",
		};

		toast.success("Goal created");
		setCurrentGoals([...currentGoals, newGoal]);
	};

	const updateGoalProgress = (id: string, newProgress: number) => {
		setCurrentGoals((prevGoals) => {
			const updatedGoals = prevGoals.map((goal) =>
				goal.id === id ? { ...goal, progress: newProgress } : goal
			);

			const goalToComplete = updatedGoals.find(
				(goal) => goal.id === id && goal.progress === 100
			);

			if (goalToComplete) {
				const remainingGoals = updatedGoals.filter((goal) => goal.id !== id);
				setCompletedGoals((prevCompleted) => [
					...prevCompleted,
					{
						...goalToComplete,
						completedDate: formatDate(new Date(), "yyyy-MM-dd"),
					},
				]);
				setIsConfetti(true);
				window.scrollTo(0, 0);
				toast.success("Congratulations, you completed your goal! 🥳", {
					duration: 5000,
				});
				return remainingGoals;
			}

			return updatedGoals;
		});
	};

	const completeGoal = (id: string) => {
		const completedGoal = currentGoals.find((goal) => goal.id === id);
		if (completedGoal) {
			setCompletedGoals([
				...completedGoals,
				{
					...completedGoal,
					completedDate: formatDate(new Date(), "yyyy-MM-dd"),
				},
			]);
			setCurrentGoals(currentGoals.filter((goal) => goal.id !== id));
			window.scrollTo(0, 0);
			toast.success("Congratulations, you completed your goal! 🥳", {
				duration: 5000,
			});
			setIsConfetti(true);
		}
	};

	const reattemptGoal = (id: string) => {
		const goalToReattempt = completedGoals.find((goal) => goal.id === id);
		if (goalToReattempt) {
			setCurrentGoals([
				...currentGoals,
				{
					...goalToReattempt,
					progress: 0,
					deadline: formatDate(
						new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
						"yyyy-MM-dd"
					),
				},
			]);
			setCompletedGoals(completedGoals.filter((goal) => goal.id !== id));
		}
	};

	const deleteCurrentGoal = (id: string) => {
		const updatedGoals = currentGoals.filter((g) => g.id !== id);
		toast.success("Goal deleted successfully");
		setCurrentGoals(updatedGoals);
	};

	const deleteCompletedGoal = (id: string) => {
		const updatedGoals = completedGoals.filter((g) => g.id !== id);
		toast.success("Goal deleted successfully");
		setCompletedGoals(updatedGoals);
	};

	return (
		<div className="container mx-auto p-4 xl:p-10 overflow-x-hidden">
			{isConfetti && (
				<Confetti width={width} height={height} tweenDuration={5} />
			)}
			<Navbar />
			<h1 className="text-3xl font-bold mb-6">Your Fitness Goals</h1>
			<div>
				<SetNewGoal onSubmit={onSubmitNewGoal} />
			</div>
			<CurrentGoals
				goals={currentGoals}
				onUpdateProgress={updateGoalProgress}
				onCompleteGoal={completeGoal}
				onDeleteGoal={deleteCurrentGoal}
			/>
			<CompletedGoals
				goals={completedGoals}
				onReattemptGoal={reattemptGoal}
				onDeleteGoal={deleteCompletedGoal}
			/>
		</div>
	);
}
