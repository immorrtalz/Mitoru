import { useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from "@dnd-kit/react/sortable";

import Button, { ButtonStyle } from "../components/Button";
import { TopBar } from "../components/TopBar";
import BoardItem from "../components/BoardItem";

import useTranslations from "../hooks/useTranslations";

import { useBoardsContext } from "../context/BoardsContext";
import { Id } from "../hooks/useKanban";

function Home()
{
	const navigate = useNavigate();
	const { state, createBoard, reorderBoards } = useBoardsContext();
	const { translate } = useTranslations();

	const boardsContainerRef = useRef<HTMLDivElement>(null);

	const createNewBoard = () =>
	{
		const boardNumber = state.boardsOrder.length + 1;
		createBoard(`${translate("board")} ${boardNumber}`);
	};

	const onBoardOpen = (id: Id) =>
	{
		navigate(`/kanban/${id}`);
	};

	return (
		<div className='mainContainer'>
			<TopBar/>

			<div className={styles.boardsPageContainer}>
				<h2 className={styles.boardsTitle}>{translate("boards")}</h2>

				<DragDropProvider onDragEnd={({ operation }) =>
				{
					const { source } = operation;
					if (!isSortable(source)) return;

					const { index, initialIndex } = source;
					if (index === initialIndex) return;

					reorderBoards(source.id as Id, index);
				}}>
					<div className={`${styles.boardsContainer} maskedVerticalScrollContainer`} ref={boardsContainerRef}>
					{
						state.boardsOrder.map((boardId, index) =>
						{
							const board = state.boards[boardId];
							if (!board) return null;

							return <BoardItem key={`board-${board.id}`} container={boardsContainerRef} sortableIndex={index}
								board={board} onClick={() => onBoardOpen(board.id)}/>;
						})
					}
					</div>
				</DragDropProvider>

				<Button buttonStyle={ButtonStyle.Primary} onClick={createNewBoard}>{translate("create_a_new_board")}</Button>
			</div>

		</div>
	);
}

export default Home;