import { useContext } from "react";
import SettingsContext from "../../context/BoardsContext";
import { Board, Column, Tag, Task } from "../../misc/boards";
import { Color, isBoolean, isNumber, isRecord, isString, } from "../../misc/utils";

const BOARDS_LOCAL_STORAGE_KEY = 'boards';
const toNumberArray = (value: unknown): number[] => Array.isArray(value) ? value.filter(isNumber) : [];

const normalizeColor = (value: unknown): Color | null =>
{
	if (!isRecord(value)) return null;
	if (!isNumber(value.h) || !isNumber(value.s) || !isNumber(value.b) || !isNumber(value.a)) return null;

	return {
		h: value.h,
		s: value.s,
		b: value.b,
		a: value.a
	};
};

const normalizeTag = (value: unknown): Tag | null =>
{
	if (!isRecord(value)) return null;
	if (!isNumber(value.id) || !isString(value.title)) return null;

	const color = normalizeColor(value.color);
	if (color == null) return null;

	return {
		id: value.id,
		title: value.title,
		color
	};
};

const normalizeColumn = (value: unknown): Column | null =>
{
	if (!isRecord(value)) return null;
	if (!isNumber(value.id) || !isString(value.title)) return null;

	const color = normalizeColor(value.color);
	if (color == null) return null;

	return {
		id: value.id,
		title: value.title,
		color,
		tasksIds: toNumberArray(value.tasksIds)
	};
};

const normalizeTask = (value: unknown): Task | null =>
{
	if (!isRecord(value)) return null;
	if (!isNumber(value.id) || !isString(value.title)) return null;

	const color = normalizeColor(value.color);
	if (color == null) return null;

	return {
		id: value.id,
		title: value.title,
		color,
		isCompleted: isBoolean(value.isCompleted) ? value.isCompleted : false,
		tagsIds: toNumberArray(value.tagsIds),
		text: isString(value.text) ? value.text : '',
		checklistsIds: toNumberArray(value.checklistsIds)
	};
};

const normalizeBoard = (value: unknown): Board | null =>
{
	if (!isRecord(value)) return null;
	if (!isNumber(value.id) || !isString(value.title)) return null;

	const tags = (Array.isArray(value.tags) ? value.tags : []).map(normalizeTag).filter((tag): tag is Tag => tag != null);
	const columns = (Array.isArray(value.columns) ? value.columns : []).map(normalizeColumn).filter((column): column is Column => column != null);
	const tasks = (Array.isArray(value.tasks) ? value.tasks : []).map(normalizeTask).filter((task): task is Task => task != null);

	return {
		id: value.id,
		title: value.title,
		tags,
		columns,
		tasks
	};
};

const normalizeBoardArray = (value: unknown): Board[] =>
{
	if (!Array.isArray(value)) return [];
	return value.map(normalizeBoard).filter((board): board is Board => board != null);
};

export default function useBoardsLoader()
{
	const { setBoards } = useContext(SettingsContext);

	const loadBoardsFromLocalStorage = async (): Promise<Board[]> =>
	{
		const boardsFromLocalStorage = localStorage.getItem(BOARDS_LOCAL_STORAGE_KEY);

		if (boardsFromLocalStorage != null)
		{
			try
			{
				const parsedBoards = JSON.parse(boardsFromLocalStorage) as unknown;
				const loadedBoards = normalizeBoardArray(parsedBoards);
				await saveBoardsToLocalStorage(loadedBoards);
				setBoards(loadedBoards);
				return loadedBoards;
			}
			catch (e)
			{
				console.error("Error loading boards from localStorage:", e);
				await saveBoardsToLocalStorage([]);
				setBoards([]);
				return [];
			}
		}

		await saveBoardsToLocalStorage([]);
		setBoards([]);
		return [];
	};

	const saveBoardsToLocalStorage = async (newBoards: Board[]) => localStorage.setItem(BOARDS_LOCAL_STORAGE_KEY, JSON.stringify(newBoards));

	return { loadBoardsFromLocalStorage, saveBoardsToLocalStorage };
}