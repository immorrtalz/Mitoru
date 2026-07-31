import styles from './BoardItem.module.scss';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
import Separator from '../Separator';
import { SVG } from '../SVG';

import useTranslations from '../../hooks/useTranslations';
import { Board } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';

import { isNewBoardTitleValid, MAX_BOARD_TITLE_LENGTH } from '../../misc/boards';
import { HorizontalAlign, Orientation } from '../../misc/utils';

import { useBoardsContext } from '../../context/BoardsContext';

interface Props
{
	board: Board;
	onClick?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
}

export default function BoardItem(props: Props)
{
	const board = props.board;

	const { translate } = useTranslations();
	const { renameBoard, deleteBoard } = useBoardsContext();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();

	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();
	const onClick = (e: React.MouseEvent<HTMLElement>) => props.onClick?.(e);

	const onBoardRenameDialog = (currentTitle: string) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_board"),
			description: `${translate("enter_a_new_board_name")}\.\n${translate("max_length_is")} ${MAX_BOARD_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_BOARD_TITLE_LENGTH,
			validate: v => isNewBoardTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameBoard(board.id, result.trim())
		});
	};

	const onBoardDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_board"),
			description: `${translate("are_you_sure_delete_the_board")} "${board.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: ButtonVariant.Negative,
			onConfirm: () => deleteBoard(board.id)
		});
	};

	const onBoardContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: <>
				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
					onClick={() => onBoardRenameDialog(board.title)}>
					<SVG name="edit"/>
					{translate("rename")}
				</Button>

				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
					{translate("duplicate")}
				</Button>

				<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>

				<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onBoardDeleteDialog}>
					<SVG name="delete"/>
					{translate("delete")}
				</Button>
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<div className={`${styles.boardItem} ${props.className || ''}`} onClick={onClick}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			<p className={styles.title}>{board.title}</p>
			{props.children}

			<Button buttonStyle={ButtonStyle.Ghost} small square onClick={e => onBoardContextMenu(e.currentTarget.getBoundingClientRect())}><SVG name='menuDots'/></Button>
		</div>
	);
}