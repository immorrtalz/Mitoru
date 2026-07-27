import { KanbanState } from "../hooks/useKanban";
import { isRecord } from "./utils";

export const MAX_BOARD_TITLE_LENGTH = 64;
export const MAX_TAG_TITLE_LENGTH = 32;
export const MAX_COLUMN_TITLE_LENGTH = 256;
export const MAX_TASK_TITLE_LENGTH = 512;
export const MAX_TASK_TEXT_LENGTH = 16384;
export const MAX_CHECKLIST_TITLE_LENGTH = 512;

const BOARDS_LOCAL_STORAGE_KEY = 'boards';
const EMPTY_STATE: KanbanState = { boards: {}, boardsOrder: [] };

export const isNewBoardTitleValid = (newTitle: string, currentTitle?: string) =>
{
	const trimmedTitle = newTitle.trim();
	return trimmedTitle !== '' && trimmedTitle !== currentTitle && trimmedTitle.length <= MAX_BOARD_TITLE_LENGTH;
};

export const isNewColumnTitleValid = (newTitle: string, currentTitle?: string) =>
{
	const trimmedTitle = newTitle.trim();
	return trimmedTitle !== '' && trimmedTitle !== currentTitle && trimmedTitle.length <= MAX_COLUMN_TITLE_LENGTH;
};

export const isNewTaskTitleValid = (newTitle: string, currentTitle?: string) =>
{
	const trimmedTitle = newTitle.trim();
	return trimmedTitle !== '' && trimmedTitle !== currentTitle && trimmedTitle.length <= MAX_TASK_TITLE_LENGTH;
};

export const isNewTaskTextValid = (newText: string, currentText?: string) =>
	newText !== '' && newText !== currentText && newText.length <= MAX_TASK_TEXT_LENGTH;

export const isNewChecklistTitleValid = (newTitle: string, currentTitle?: string) =>
{
	const trimmedTitle = newTitle.trim();
	return trimmedTitle !== '' && trimmedTitle !== currentTitle && trimmedTitle.length <= MAX_CHECKLIST_TITLE_LENGTH;
};

// Light structural check - good enough to catch "this isn't even the right shape"
// (e.g. leftover data from before useKanban, or hand-edited localStorage), not a full validator.
const isPlausibleKanbanState = (value: unknown): value is KanbanState =>
	isRecord(value) && isRecord(value.boards) && Array.isArray(value.boardsOrder);

export const loadBoardsFromLocalStorage = (): KanbanState =>
{
	const raw = localStorage.getItem(BOARDS_LOCAL_STORAGE_KEY);
	if (raw == null) return EMPTY_STATE;

	try
	{
		const parsed = JSON.parse(raw) as unknown;
		return isPlausibleKanbanState(parsed) ? parsed : EMPTY_STATE;
	}
	catch (e)
	{
		console.error("Error loading boards from localStorage:", e);
		return EMPTY_STATE;
	}
}

export const saveBoardsToLocalStorage = (state: KanbanState): void =>
	localStorage.setItem(BOARDS_LOCAL_STORAGE_KEY, JSON.stringify(state));