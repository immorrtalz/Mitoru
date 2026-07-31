import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

import Button, { ButtonVariant, ButtonStyle } from "../components/Button";
import { TopBar } from "../components/TopBar";
import BoardItem from "../components/BoardItem";

import useTranslations from "../hooks/useTranslations";

import { useBoardsContext } from "../context/BoardsContext";
import { Id } from "../hooks/useKanban";

function Home()
{
	const navigate = useNavigate();
	const { state, createBoard } = useBoardsContext();
	const { translate } = useTranslations();
	
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

				<div className={styles.boardsContainer}>
				{
					state.boardsOrder.map(boardId =>
					{
						const board = state.boards[boardId];
						if (!board) return null;

						return <BoardItem key={`board-${board.id}`} board={board} onClick={() => onBoardOpen(board.id)}/>;
					})
				}
				</div>

				<Button buttonStyle={ButtonStyle.Primary} onClick={createNewBoard}>{translate("create_a_new_board")}</Button>
			</div>

		</div>
	);
}

export default Home;