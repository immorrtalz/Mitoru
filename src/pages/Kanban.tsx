import { useContext } from "react";
import { useParams } from "react-router";
import styles from "./Kanban.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";

import useTranslations from "../hooks/useTranslations";
import { getNextId, Color } from "../misc/utils";
import { Board, Column } from "../misc/boards";

import BoardsContext from "../context/BoardsContext";

function Kanban()
{
	const { boards, setBoards } = useContext(BoardsContext);
	const { translate } = useTranslations();

	let params = useParams();

	const boardId = params.boardId === undefined ? -1 : parseInt(params.boardId, 10);
	const board = boards.find(board => board.id === boardId);
	let boardName = '';

	if (board !== undefined) boardName = boardId === -1 ? 'Invalid board' : `${board.title}`;

	const createNewColumn = () =>
	{
		if (board === undefined) return;

		const newId = getNextId(board.columns.map(column => column.id));

		const newColumn: Column =
		{
			id: newId,
			title: `${translate("column")} ${newId}`,
			color: { h: 0, s: 0, b: 0, a: 0 } as Color,
			tasksIds: []
		};

		setBoards(boards.map(item =>
		{
			if (item.id !== boardId) return item;

			return {
				...item,
				columns: [...item.columns, newColumn]
			};
		}));
	};

	return (
		<div className='mainContainer'>
			<TopBar pageName={boardName}></TopBar>

			<div className={styles.kanbanPageContainer}>
				{
					board?.columns.map(column => (<KanbanColumn key={`column-${column.id}`} id={column.id} boardId={boardId}/>))
				}
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