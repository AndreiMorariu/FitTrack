type DateFormat = "PPP" | "yyyy-MM-dd";

export function formatDate(date: Date, format: DateFormat): string {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	if (format === "PPP") {
		const longMonth = date.toLocaleString("default", { month: "long" });
		return `${longMonth} ${day}, ${year}`;
	}

	if (format === "yyyy-MM-dd") return `${year}-${month}-${day}`;

	throw new Error("Unsupported format");
}
