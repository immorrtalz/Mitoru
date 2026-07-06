import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

import { SVG } from "../components/SVG";
import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import BoardItem from "../components/BoardItem";

import useTranslations from "../hooks/useTranslations";

import { useBoardsContext } from "../context/BoardsContext";
import { Id } from "../hooks/useKanban";

import { useGistAPIContext } from "../context/GistAPIContext";
import useDialog from "../hooks/useDialog";
import { isNewBoardTitleValid, MAX_BOARD_TITLE_LENGTH } from "../misc/boards";
import { TextBox } from "../components/TextBox";

function Home()
{
	const navigate = useNavigate();
	const { state, loadState, createBoard, renameBoard, deleteBoard } = useBoardsContext();
	const { initOctokit, createGist, getGistContent, updateGist } = useGistAPIContext();
	const { translate } = useTranslations();
	const { openDialog, openPromptDialog } = useDialog();
	
	const createNewBoard = () =>
	{
		const boardNumber = state.boardsOrder.length + 1;
		createBoard(`${translate("board")} ${boardNumber}`);
	};

	const onBoardOpen = (id: Id) =>
	{
		navigate(`/kanban/${id}`);
	};

	const onBoardRenameDialog = (id: Id, currentTitle: string) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_board"),
			description: `${translate("enter_new_board_name")}\.\n${translate("max_length_is")} ${MAX_BOARD_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_BOARD_TITLE_LENGTH,
			validate: v => isNewBoardTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameBoard(id, result.trim())
		});
	};

	const onBoardDeleteDialog = (id: Id) =>
	{
		openDialog(
		{
			title: translate("delete_the_board"),
			description: `${translate("are_you_sure_delete_the_board")} "${state.boards[id]?.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmType: ButtonType.Negative,
			onConfirm: () => deleteBoard(id)
		});
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

						return (
						<BoardItem key={`board-${board.id}`} title={board.title} onClick={() => onBoardOpen(board.id)}>
							<Button type={ButtonType.SimpleSecondary} square small onClick={() => onBoardRenameDialog(board.id, board.title)}><SVG name='edit'/></Button>
							<Button type={ButtonType.Negative} square small onClick={() => onBoardDeleteDialog(board.id)}><SVG name='delete'/></Button>
						</BoardItem>);
					})
				}
				</div>

				<Button type={ButtonType.Primary} onClick={createNewBoard}>{translate("create_new_board")}</Button>
			</div>

		</div>
	);
}

export default Home;