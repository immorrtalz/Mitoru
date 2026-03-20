import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./Kanban.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import KanbanColumn from "../components/KanbanColumn";

import useTranslations from "../hooks/useTranslations";
import { Color, getNextId } from "../misc/utils";
import { Column } from "../misc/boards";

import BoardsContext from "../context/BoardsContext";

function Kanban()
{
	const navigate = useNavigate();
	const { boards, setBoards } = useContext(BoardsContext);
	const { translate } = useTranslations();

	const params = useParams();
	const boardId = params.boardId === undefined ? NaN : Number.parseInt(params.boardId, 10);
	const board = Number.isFinite(boardId) ? boards.find(item => item.id === boardId) : undefined;

	useEffect(() =>
	{
		if (board === undefined) navigate('/');
	}, [board, navigate]);

	if (board === undefined) return null;

	const boardName = board.title;

	const createNewColumn = () =>
	{
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
					board?.columns.map(column => (<KanbanColumn key={`column-${column.id}`} id={column.id}/>))
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