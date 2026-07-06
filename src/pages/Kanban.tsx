import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Kanban.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";

import useTranslations from "../hooks/useTranslations";
import useBoardFromRoute from "../hooks/useBoardFromRoute";
import { Color, getNextId } from "../misc/utils";

import BoardsContext, { useBoardsContext } from "../context/BoardsContext";

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
				{ board.columnsOrder.map(columnId =>
				{
					const column = board.columns[columnId];
					if (!column) return null;
					return <KanbanColumn key={`column-${column.id}`} board={board} column={column}/>;
				}) }

				<Button type={ButtonType.Secondary} onClick={createNewColumn}>
					<>
						<SVG name='plus'/>
						{translate('create_new_column')}
					</>
				</Button>
			</div>
		</div>
	);
}

export default Kanban;