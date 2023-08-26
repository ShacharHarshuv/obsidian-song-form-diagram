export function fillArray<T>(length: number, value: T): T[] {
	return Array(length).fill(value);
}
