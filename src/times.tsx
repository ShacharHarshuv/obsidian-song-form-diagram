export function times(n: number, redner: (i: number) => React.ReactNode) {
	return [...Array(n)].map((_, i) => redner(i));
}
