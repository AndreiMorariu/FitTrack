import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Dumbbell, Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "Workouts", href: "/workouts" },
	// { name: "Progress", href: "/progress" },
	{ name: "Goals", href: "/goals" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const NavItems = () => (
		<>
			{navLinks.map((link) => (
				<NavLink
					key={link.name}
					to={link.href}
					className={({ isActive }) =>
						`${
							isActive ? "text-primary" : "text-muted-foreground"
						} hover:text-primary transition-colors`
					}
					onClick={() => setIsOpen(false)}
				>
					{link.name}
				</NavLink>
			))}
			<ModeToggle />
		</>
	);

	return (
		<nav className="flex items-center justify-between bg-background py-4 mb-4">
			<Link to="/" className="flex items-center space-x-2">
				<Dumbbell className="w-6 h-6" />
				<span className="text-xl font-bold">FitTrack</span>
			</Link>

			{/* Desktop menu */}
			<div className="hidden md:flex items-center space-x-4 ">
				<NavItems />
			</div>

			{/* Mobile menu */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<div className="flex flex-col space-y-4 mt-4">
						<NavItems />
					</div>
				</SheetContent>
			</Sheet>
		</nav>
	);
}
