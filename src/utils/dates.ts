type DateFormat = "PPP" | "yyyy-MM-dd";

export function formatDate(date: Date, format: DateFormat): string {
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDay();

	if (format === "yyyy-MM-dd") {
		const longMonth = date.toLocaleString("default", { month: "long" });
		return `${longMonth}-${day}, ${year}`;
	}

	if (format === "PPP") return `${year}-${month}-${day}`;

	throw new Error("Unsupported format");
}
