export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
export const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export interface Color
{
	h: number;
	s: number;
	b: number;
	a: number;
}

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
export const lerp = (start: number, end: number, t: number): number => start + (end - start) * t;

export const lerpHexColors = (color1: string, color2: string, t: number): string =>
{
	const r1 = parseInt(color1.slice(1, 3), 16);
	const g1 = parseInt(color1.slice(3, 5), 16);
	const b1 = parseInt(color1.slice(5, 7), 16);

	const r2 = parseInt(color2.slice(1, 3), 16);
	const g2 = parseInt(color2.slice(3, 5), 16);
	const b2 = parseInt(color2.slice(5, 7), 16);

	const r = Math.round(r1 + (r2 - r1) * t);
	const g = Math.round(g1 + (g2 - g1) * t);
	const b = Math.round(b1 + (b2 - b1) * t);

	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const lerpHexColorsWithStops = (stops: Array<{ color: string; position: number }>, t: number): string =>
{
	const sortedStops = [...stops].sort((a, b) => a.position - b.position);

	if (t <= sortedStops[0].position) return sortedStops[0].color;
	if (t >= sortedStops[sortedStops.length - 1].position) return sortedStops[sortedStops.length - 1].color;

	for (let i = 0; i < sortedStops.length - 1; i++)
	{
		if (t >= sortedStops[i].position && t <= sortedStops[i + 1].position)
		{
			const localT = (t - sortedStops[i].position) / (sortedStops[i + 1].position - sortedStops[i].position);
			return lerpHexColors(sortedStops[i].color, sortedStops[i + 1].color, localT);
		}
	}

	return sortedStops[0].color;
};

/**
	@param `num` A number to be rounded.
	@param `fractionDigits` The number of decimal places to round to. Must be an integer between 0 and 20 (inclusive). If it's out of range or not an integer, it will be clamped to the nearest valid integer value.
	@returns The rounded number.
*/
export const round = (num: number, fractionDigits: number = 0) =>
{
	const digits = fractionDigits < 0 || fractionDigits > 20 ? clamp(fractionDigits, 0, 20) : (Number.isInteger(fractionDigits) ? fractionDigits : Math.round(fractionDigits));
	return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
};

/**
	Generates the next unique ID based on an array of existing IDs. It finds the smallest positive integer that is not present in the array.

	@param existingIds An array of existing IDs (numbers).
	@returns The next unique ID.
*/
export const getNextId = (existingIds: number[]): number =>
{
	if (existingIds.length === 0) return 1;

	const ids = [...existingIds].sort((a, b) => a - b);
	let newId = 1;

	for (const id of ids)
	{
		if (id !== newId) break;
		newId++;
	}

	return newId;
}