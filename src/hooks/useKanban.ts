import { useState } from "react";

export type Id = string;
export type Color = string;

export interface KanbanState
{
	boards: Record<Id, Board>;
	boardsOrder: Id[];
	gistId?: string;
}

export interface Board
{
	id: Id;
	title: string;
	tags: Record<Id, Tag>;
	columns: Record<Id, Column>;
	tasks: Record<Id, Task>;
	columnsOrder: Id[];
	tasksOrderInColumn: Record<Id, Id[]>;
}

export interface Tag
{
	id: Id;
	title: string;
	color: Color;
}

export interface Column
{
	id: Id;
	title: string;
	color: Color;
}

export interface Task
{
	id: Id;
	title: string;
	color: Color;
	isCompleted: boolean;
	tagsIds: Id[];
	text: string;
	checklistsOrder: Id[];
	checklists: Record<Id, Checklist>;
}

export interface Checklist
{
	id: Id;
	title: string;
	itemsOrder: Id[];
	items: Record<Id, ChecklistItem>;
}

export interface ChecklistItem
{
	id: Id;
	title: string;
	isCompleted: boolean;
}

const DEFAULT_COLOR = "#BFBFBF";

const genId = (): Id => crypto.randomUUID();

const makeBoard = (title: string): Board =>
{
	return {
		id: genId(),
		title,
		tags: {},
		columns: {},
		tasks: {},
		columnsOrder: [],
		tasksOrderInColumn: {},
	};
};

const makeColumn = (title: string, color: Color = DEFAULT_COLOR): Column => ({ id: genId(), title, color });

const makeTask = (title: string, color: Color = DEFAULT_COLOR): Task =>
{
	return {
		id: genId(),
		title,
		color,
		isCompleted: false,
		tagsIds: [],
		text: "",
		checklistsOrder: [],
		checklists: {},
	};
};

const makeTag = (title: string, color: Color = DEFAULT_COLOR): Tag => ({ id: genId(), title, color });
const makeChecklist = (title: string): Checklist => ({ id: genId(), title, itemsOrder: [], items: {} });
const makeChecklistItem = (title: string): ChecklistItem => ({ id: genId(), title, isCompleted: false });

// This exists just in case
const removeIdFromArray = (arr: Id[], id: Id): Id[] => arr.filter(x => x !== id);

const moveIdInArray = (arr: Id[], id: Id, toIndex: number): Id[] =>
{
	const without = removeIdFromArray(arr, id);
	const index = Math.max(0, Math.min(toIndex, without.length));
	return [...without.slice(0, index), id, ...without.slice(index)];
};

// Each helper updates one nested level without touching the rest.
const stateWithBoard = (state: KanbanState, boardId: Id, fn: (board: Board) => Board): KanbanState =>
{
	const board = state.boards[boardId];
	return board ? { ...state, boards: { ...state.boards, [boardId]: fn(board) } } : state;
};

const boardWithTask = (board: Board, taskId: Id, fn: (task: Task) => Task): Board =>
{
	const task = board.tasks[taskId];
	return task ? { ...board, tasks: { ...board.tasks, [taskId]: fn(task) } } : board;
};

const taskWithChecklist = (task: Task, checklistId: Id, fn: (checklist: Checklist) => Checklist): Task =>
{
	const checklist = task.checklists[checklistId];
	return checklist ? { ...task, checklists: { ...task.checklists, [checklistId]: fn(checklist) }, } : task;
};

const EMPTY_STATE: KanbanState = { boards: {}, boardsOrder: [] };

export default function useKanban(initialState: KanbanState = EMPTY_STATE)
{
	const [state, setState] = useState<KanbanState>(initialState);

	// Escape hatch for hydrating the whole state at once (e.g. after loading from localStorage/a file).
	// Not meant for incremental updates — use the actions above for those.
	const loadState = (newState: KanbanState) => setState(newState);

	// Boards
	const createBoard = (title: string) =>
	{
		setState(prev =>
		{
			const board = makeBoard(title);
			const boards = { ...prev.boards, [board.id]: board };

			return { boards, boardsOrder: [board.id, ...prev.boardsOrder] };
		});
	};

	const renameBoard = (boardId: Id, title: string) =>
		setState(prev => stateWithBoard(prev, boardId, b => ({ ...b, title })));

	const deleteBoard = (boardId: Id) =>
	{
		setState(prev =>
		{
			const boards = { ...prev.boards };
			delete boards[boardId];

			return { boards, boardsOrder: removeIdFromArray(prev.boardsOrder, boardId) };
		});
	};

	const reorderBoards = (boardId: Id, toIndex: number) =>
		setState(prev => ({ ...prev, boardsOrder: moveIdInArray(prev.boardsOrder, boardId, toIndex)}));

	// Columns
	const createColumn = (boardId: Id, title: string, color?: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const column = makeColumn(title, color);

				return {
					...board,
					columns: { ...board.columns, [column.id]: column },
					columnsOrder: [...board.columnsOrder, column.id],
					tasksOrderInColumn: { ...board.tasksOrderInColumn, [column.id]: [] },
				};
			}));
	};

	const renameColumn = (boardId: Id, columnId: Id, title: string) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				({ ...board, columns: { ...board.columns, [columnId]: { ...board.columns[columnId], title } } })));
	};

	const setColumnColor = (boardId: Id, columnId: Id, color: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				({ ...board, columns: { ...board.columns, [columnId]: { ...board.columns[columnId], color } } })));
	};

	const deleteColumn = (boardId: Id, columnId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const taskIds = board.tasksOrderInColumn[columnId] ?? [];
				const tasks = { ...board.tasks };
				taskIds.forEach(taskId => delete tasks[taskId]);

				const columns = { ...board.columns };
				delete columns[columnId];

				const tasksOrderInColumn = { ...board.tasksOrderInColumn };
				delete tasksOrderInColumn[columnId];

				return {
					...board,
					columns,
					tasks,
					tasksOrderInColumn,
					columnsOrder: removeIdFromArray(board.columnsOrder, columnId),
				};
			}));
	};

	const reorderColumns = (boardId: Id, columnId: Id, toIndex: number) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				({ ...board, columnsOrder: moveIdInArray(board.columnsOrder, columnId, toIndex) })));
	};

	// Tasks
	const createTask = (boardId: Id, columnId: Id, title: string, color?: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const task = makeTask(title, color);
				const columnTasksOrder = board.tasksOrderInColumn[columnId] ?? [];

				return {
					...board,
					tasks: { ...board.tasks, [task.id]: task },
					tasksOrderInColumn:
					{
						...board.tasksOrderInColumn,
						[columnId]: [...columnTasksOrder, task.id],
					},
				};
			}));
	};

	const renameTask = (boardId: Id, taskId: Id, title: string) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, title }))));
	};

	const setTaskColor = (boardId: Id, taskId: Id, color: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, color }))));
	};

	const setTaskText = (boardId: Id, taskId: Id, text: string) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, text }))));
	};

	const toggleTaskCompleted = (boardId: Id, taskId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, isCompleted: !task.isCompleted }))));
	};

	const deleteTask = (boardId: Id, taskId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const tasks = { ...board.tasks };
				delete tasks[taskId];

				const columnId = board.columnsOrder.find(columnId => board.tasksOrderInColumn[columnId]?.includes(taskId));

				const tasksOrderInColumn = columnId ?
				{
					...board.tasksOrderInColumn,
					[columnId]: removeIdFromArray(board.tasksOrderInColumn[columnId], taskId),
				}
				: board.tasksOrderInColumn;

				return { ...board, tasks, tasksOrderInColumn };
			}));
	};

	const moveTask = (boardId: Id, taskId: Id, toColumnId: Id, toIndex: number) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const tasksOrderInColumn = { ...board.tasksOrderInColumn };

				for (const columnId of Object.keys(tasksOrderInColumn))
					if (tasksOrderInColumn[columnId].includes(taskId))
						tasksOrderInColumn[columnId] = removeIdFromArray(tasksOrderInColumn[columnId], taskId);

				const target = tasksOrderInColumn[toColumnId];
				const index = Math.max(0, Math.min(toIndex, target.length));

				tasksOrderInColumn[toColumnId] = [...target.slice(0, index), taskId, ...target.slice(index)];

				return { ...board, tasksOrderInColumn };
			}));
	};

	const setTaskTags = (boardId: Id, taskId: Id, tagsIds: Id[]) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, tagsIds }))));
	};

	const createTagToTask = (boardId: Id, taskId: Id, tagId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
				{
					if (task.tagsIds.includes(tagId)) return task;

					const tagsOrder = Object.keys(board.tags);
					const tagsIds = [...task.tagsIds, tagId].sort((a, b) => tagsOrder.indexOf(a) - tagsOrder.indexOf(b));

					return { ...task, tagsIds };
				})));
	};

	const removeTagFromTask = (boardId: Id, taskId: Id, tagId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task => ({ ...task, tagsIds: removeIdFromArray(task.tagsIds, tagId) }))));
	};

	// Tags
	const createTag = (boardId: Id, title: string, color?: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const tag = makeTag(title, color);
				return { ...board, tags: { ...board.tags, [tag.id]: tag } };
			}));
	};

	const renameTag = (boardId: Id, tagId: Id, title: string) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				({ ...board, tags: { ...board.tags, [tagId]: { ...board.tags[tagId], title } } })));
	};

	const setTagColor = (boardId: Id, tagId: Id, color: Color) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				({ ...board, tags: { ...board.tags, [tagId]: { ...board.tags[tagId], color } } })));
	};

	const deleteTag = (boardId: Id, tagId: Id) =>
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
			{
				const tags = { ...board.tags };
				delete tags[tagId];

				const tasks = { ...board.tasks };

				for (const taskId of Object.keys(tasks))
				{
					const task = tasks[taskId];

					if (task.tagsIds.includes(tagId))
						tasks[taskId] = { ...task, tagsIds: removeIdFromArray(task.tagsIds, tagId) };
				}

				return { ...board, tags, tasks };
			}));
	};

	// Checklists
	function createChecklist(boardId: Id, taskId: Id, title: string)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
				{
					const checklist = makeChecklist(title);

					return {
						...task,
						checklists: { ...task.checklists, [checklist.id]: checklist },
						checklistsOrder: [...task.checklistsOrder, checklist.id],
					};
				})));
	}

	function renameChecklist(boardId: Id, taskId: Id, checklistId: Id, title: string)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, c => ({ ...c, title })))));
	}

	function deleteChecklist(boardId: Id, taskId: Id, checklistId: Id)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
				{
					const checklists = { ...task.checklists };
					delete checklists[checklistId];

					return { ...task, checklists, checklistsOrder: removeIdFromArray(task.checklistsOrder, checklistId) };
				})));
	}

	// Checklist items
	function createChecklistItem(boardId: Id, taskId: Id, checklistId: Id, title: string)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, checklist =>
					{
						const item = makeChecklistItem(title);

						return {
							...checklist,
							items: { ...checklist.items, [item.id]: item },
							itemsOrder: [...checklist.itemsOrder, item.id],
						};
					}))));
	}

	function renameChecklistItem(boardId: Id, taskId: Id, checklistId: Id, itemId: Id, title: string)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, checklist =>
						({ ...checklist, items: { ...checklist.items, [itemId]: { ...checklist.items[itemId], title } } })))));
	}

	function toggleChecklistItem(boardId: Id, taskId: Id, checklistId: Id, itemId: Id)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, checklist => (
					{
						...checklist,
						items:
						{
							...checklist.items,
							[itemId]:
							{
								...checklist.items[itemId],
								isCompleted: !checklist.items[itemId].isCompleted,
							},
						},
					})))));
	}

	function deleteChecklistItem(boardId: Id, taskId: Id, checklistId: Id, itemId: Id)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, checklist =>
					{
						const items = { ...checklist.items };
						delete items[itemId];

						return { ...checklist, items, itemsOrder: removeIdFromArray(checklist.itemsOrder, itemId) };
					}))));
	}

	function reorderChecklistItems(boardId: Id, taskId: Id, checklistId: Id, itemId: Id, toIndex: number)
	{
		setState(prev =>
			stateWithBoard(prev, boardId, board =>
				boardWithTask(board, taskId, task =>
					taskWithChecklist(task, checklistId, checklist => (
					{
						...checklist,
						itemsOrder: moveIdInArray(checklist.itemsOrder, itemId, toIndex),
					})))));
	}

	return {
		state,
		loadState,
		// Boards
		createBoard,
		renameBoard,
		deleteBoard,
		reorderBoards,
		// Columns
		createColumn,
		renameColumn,
		setColumnColor,
		deleteColumn,
		reorderColumns,
		// Tasks
		createTask,
		renameTask,
		setTaskColor,
		setTaskText,
		toggleTaskCompleted,
		deleteTask,
		moveTask,
		setTaskTags,
		createTagToTask,
		removeTagFromTask,
		// Tags
		createTag,
		renameTag,
		setTagColor,
		deleteTag,
		// Checklists
		createChecklist,
		renameChecklist,
		deleteChecklist,
		createChecklistItem,
		renameChecklistItem,
		toggleChecklistItem,
		deleteChecklistItem,
		reorderChecklistItems,
	};
}