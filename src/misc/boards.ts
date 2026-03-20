import { Color } from "./utils";

export interface Board
{
	id: number;
	title: string;
	tags: Tag[];
	columns: Column[];
	tasks: Task[];
}

export interface Tag
{
	id: number;
	title: string;
	color: Color;
}

export interface Column
{
	id: number;
	title: string;
	color: Color;
	tasksIds: number[];
}

export interface Task
{
	id: number;
	title: string;
	color: Color;
	isCompleted: boolean;
	tagsIds: number[];
	text: string;
	checklistsIds: number[];
}

export interface Checklist
{
	id: number;
	title: string;
	tasks: ChecklistTask[];
}

export interface ChecklistTask
{
	isCompleted: boolean;
	text: string;
}

export interface BoardsContextValue
{
	boards: Board[];
	setBoards: (boards: Board[]) => void;
	currentBoardId: number;
	setCurrentBoardId: (id: number) => void;
}

export const initialBoardsContextValue: BoardsContextValue =
{
	boards: [],
	setBoards: () => {},
	currentBoardId: NaN,
	setCurrentBoardId: () => {}
};