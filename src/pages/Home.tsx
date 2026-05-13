import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import BoardItem from "../components/BoardItem";
import DialogWindow from "../components/DialogWindow";
import { TextBox } from "../components/TextBox";

import useTranslations from "../hooks/useTranslations";
import { getNextId } from "../misc/utils";
import { Board, MAX_BOARD_TITLE_LENGTH } from "../misc/boards";

import BoardsContext from "../context/BoardsContext";

function Home()
{
	const navigate = useNavigate();
	const { boards, setBoards, setCurrentBoardId } = useContext(BoardsContext);
	const { translate } = useTranslations();

	const [currentlyRenamingBoardId, setCurrentlyRenamingBoardId] = useState<number | null>(null);
	const [currentlyRenamingBoardName, setCurrentlyRenamingBoardName] = useState<string>('');

	const [currentlyDeletingBoardId, setCurrentlyDeletingBoardId] = useState<number | null>(null);

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

	const onBoardRenameStart = (id: number) =>
	{
		setCurrentlyRenamingBoardName(boards.find(board => board.id === id)?.title || '');
		setCurrentlyRenamingBoardId(id);
	};

	const onBoardRenameEnd = () =>
	{
		if (currentlyRenamingBoardId === null || currentlyRenamingBoardName.trim() === '' || !isNewBoardTitleValid(currentlyRenamingBoardName)) return;

		setBoards(boards.map(board => board.id === currentlyRenamingBoardId ? { ...board, title: currentlyRenamingBoardName.trim() } : board));
		setCurrentlyRenamingBoardId(null);
	};

	const isNewBoardTitleValid = (newTitle: string) =>
	{
		const trimmedTitle = newTitle.trim();
		const isTitleAlphaNumericWithSpacesDotsAndCommas = /^[a-zA-Z0-9а-яА-Я .,]*$/.test(trimmedTitle);

		return trimmedTitle !== ''
			&& trimmedTitle.length <= MAX_BOARD_TITLE_LENGTH
			&& trimmedTitle !== boards.find(board => board.id === currentlyRenamingBoardId)?.title
			&& isTitleAlphaNumericWithSpacesDotsAndCommas;
	};

	const onBoardDeleteStart = (id: number) => setCurrentlyDeletingBoardId(id);

	const onBoardDeleteEnd = () =>
	{
		if (currentlyDeletingBoardId === null) return;

		setBoards(boards.filter(board => board.id !== currentlyDeletingBoardId));
		setCurrentlyDeletingBoardId(null);
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
					boards.map(board => (
					<BoardItem key={`board-${board.id}`} title={board.title} onClick={() => onBoardOpen(board.id)}>
						<Button type={ButtonType.Small} square onClick={() => onBoardRenameStart(board.id)}><SVG name='edit'/></Button>
						<Button type={ButtonType.SmallNegative} square onClick={() => onBoardDeleteStart(board.id)}><SVG name='delete'/></Button>
					</BoardItem>))
				}
				</div>

				<Button type={ButtonType.Primary} onClick={createNewBoard}>{translate("create_new_board")}</Button>
			</div>

			{
				currentlyRenamingBoardId != null &&
				<DialogWindow
					title={translate("rename_the_board")}
					description={`${translate("enter_new_board_name")}.\n${translate("max_length_is")} ${MAX_BOARD_TITLE_LENGTH}`}
					confirmTitle={translate('rename')}
					confirmDisabled={isNewBoardTitleValid(currentlyRenamingBoardName) === false}
					onCancel={() => setCurrentlyRenamingBoardId(null)}
					onConfirm={onBoardRenameEnd}>

					<TextBox
						value={currentlyRenamingBoardName}
						maxLength={MAX_BOARD_TITLE_LENGTH}
						onInput={e => setCurrentlyRenamingBoardName((e.target as HTMLInputElement).value)}
						onEditingEnded={e => setCurrentlyRenamingBoardName((e.target as HTMLInputElement).value)}
						onEnterPressed={onBoardRenameEnd}/>
				</DialogWindow>
			}

			{
				currentlyDeletingBoardId != null &&
				<DialogWindow
					title={translate("delete_the_board")}
					description={`${translate("are_you_sure_delete_the_board")} "${boards.find(board => board.id === currentlyDeletingBoardId)?.title}"?\n${translate("this_action_cannot_be_undone")}.`}
					confirmTitle={translate('delete')}
					confirmType={ButtonType.Negative}
					onCancel={() => setCurrentlyDeletingBoardId(null)}
					onConfirm={onBoardDeleteEnd}/>
			}
		</div>
	);
}

export default Home;