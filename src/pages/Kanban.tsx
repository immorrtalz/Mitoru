import { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Kanban.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";

import useTranslations from "../hooks/useTranslations";
import useBoardFromRoute from "../hooks/useBoardFromRoute";

import { useBoardsContext } from "../context/BoardsContext";

function Kanban()
{
	const navigate = useNavigate();
	const { createColumn } = useBoardsContext();
	const { translate } = useTranslations();
	const { boardId, board } = useBoardFromRoute();

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
			<TopBar pageName={boardName}/>

			<div className={styles.kanbanPageContainer}>
			{
				board.columnsOrder.map(columnId =>
				{
					const column = board.columns[columnId];
					if (!column) return null;

					const taskIds = board.tasksOrderInColumn[columnId] ?? [];
					const tasks = taskIds.map(id => board.tasks[id]).filter(Boolean);

					return <KanbanColumn key={`column-${column.id}`} boardId={board.id} column={column} tasks={tasks}/>;
				})
			}

				<Button type={ButtonType.Secondary} onClick={createNewColumn} dimmed>
					<>
						<SVG name='plus'/>
						{translate('create_a_new_column')}
					</>
				</Button>
			</div>
		</div>
	);
}

export default Kanban;