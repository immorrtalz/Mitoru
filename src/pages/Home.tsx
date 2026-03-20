import { useContext } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import BoardItem from "../components/BoardItem";

import useTranslations from "../hooks/useTranslations";
import { getNextId } from "../misc/utils";
import { Board } from "../misc/boards";

import BoardsContext from "../context/BoardsContext";

function Home()
{
	const navigate = useNavigate();
	const { boards, setBoards, setCurrentBoardId } = useContext(BoardsContext);
	const { translate } = useTranslations();

	const createNewBoard = () =>
	{
		const newId = getNextId(boards.map(board => board.id));

		const newBoard: Board =
		{
			id: newId,
			title: `${translate("board")} ${newId}`,
			tags: [],
			columns: [],
			tasks: []
		};

		setBoards([...boards, newBoard]);
	};

	const onBoardOpen = (id: number) =>
	{
		setCurrentBoardId(id);
		navigate(`/kanban/${id}`);
	};

	return (
		<div className='mainContainer'>
			<TopBar>
				<Button type={ButtonType.Primary} onClick={createNewBoard}>{translate("create_new_board")}</Button>
			</TopBar>

			<div className={styles.boardsPageContainer}>
				<h2>{translate("boards")}</h2>

				<div className={styles.boardsContainer}>
				{
					boards.map(board => (<BoardItem key={`board-${board.id}`} title={board.title} onClick={() => onBoardOpen(board.id)}/>))
				}
				</div>

				<Button type={ButtonType.Primary} onClick={createNewBoard}>{translate("create_new_board")}</Button>
			</div>
		</div>
	);
}

export default Home;