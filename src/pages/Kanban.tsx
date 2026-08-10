import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Kanban.module.scss";
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from '@dnd-kit/helpers';

import { SVG } from "../components/SVG";
import Button, { ButtonStyle } from "../components/Button";
import { TopBar } from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";

import useTranslations from "../hooks/useTranslations";
import useBoardFromRoute from "../hooks/useBoardFromRoute";
import { Id } from "../hooks/useKanban";

import { useBoardsContext } from "../context/BoardsContext";

function Kanban()
{
	const navigate = useNavigate();
	const { createColumn, reorderColumns, setTasksOrderInColumn } = useBoardsContext();
	const { translate } = useTranslations();
	const { boardId, board } = useBoardFromRoute();

	const columnsContainerRef = useRef<HTMLDivElement>(null);
	const previousTasksOrder = useRef<Record<Id, Id[]> | null>(null);

	useEffect(() =>
	{
		if (board === undefined) navigate('/');
	}, [board, navigate]);

	if (board === undefined || boardId === undefined) return null;

	const boardName = board.title;

	const createNewColumn = () =>
	{
		const columnNumber = board.columnsOrder.length + 1;
		createColumn(boardId, `${translate("column")} ${columnNumber}`);
	};

	return (
		<div className='mainContainer'>
			<TopBar pageName={boardName} boardId={boardId}/>

			<DragDropProvider
				onDragStart={() => previousTasksOrder.current = board.tasksOrderInColumn}
				onDragOver={event =>
				{
					const { source } = event.operation;
					if (source?.type !== 'task') return;
					setTasksOrderInColumn(boardId, prev => move(prev, event));
				}}
				onDragEnd={({ operation, canceled }) =>
				{
					const { source } = operation;

					if (canceled)
					{
						if (source?.type === 'task' && previousTasksOrder.current)
							setTasksOrderInColumn(boardId, () => previousTasksOrder.current!);
						return;
					}

					if (!isSortable(source) || source.type !== 'column') return;

					const { index, initialIndex } = source;
					if (index === initialIndex) return;

					reorderColumns(boardId, source.id as Id, index);
				}}>
				<div className={styles.kanbanPageContainer} ref={columnsContainerRef}>
				{
					board.columnsOrder.map((columnId, index) =>
					{
						const column = board.columns[columnId];
						if (!column) return null;

						const taskIds = board.tasksOrderInColumn[columnId] ?? [];
						const tasks = taskIds.map(id => board.tasks[id]).filter(Boolean);

						return <KanbanColumn key={`column-${column.id}`} container={columnsContainerRef} sortableIndex={index}
							boardId={board.id} column={column} tasks={tasks} tags={board.tags}/>;
					})
				}

					<Button buttonStyle={ButtonStyle.Outlined} dimmed onClick={createNewColumn}>
						<SVG name='plus'/>
						{translate('create_a_new_column')}
					</Button>
				</div>
			</DragDropProvider>
		</div>
	);
}

export default Kanban;