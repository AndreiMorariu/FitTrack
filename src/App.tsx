import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Goals from "./pages/Goals";

import { ThemeProvider } from "@/components/ui/theme-provider";

export default function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Toaster position="top-center" />
			<BrowserRouter>
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} index />
					<Route path="/workouts" element={<Workouts />} />
					<Route path="/goals" element={<Goals />} />
					<Route path="*" element={<Navigate to="/dashboard" />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}
