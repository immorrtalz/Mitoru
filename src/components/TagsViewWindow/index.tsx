import { useRef } from 'react';
import styles from './TagsViewWindow.module.scss';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
import KanbanTag from '../KanbanTag';
import Separator from '../Separator';
import { SVG } from '../SVG';

import useTranslations, { TranslationKey } from "../../hooks/useTranslations";
import { Id, Tag } from '../../hooks/useKanban';

import { isNewTagTitleValid, MAX_TAG_TITLE_LENGTH } from '../../misc/boards';

import { useBoardsContext } from '../../context/BoardsContext';
import { HorizontalAlign, Orientation } from '../../misc/utils';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';

interface Props
{
	boardId: Id;
	className?: string;
	onCancel?: (...args: any[]) => any;
	canBackdropCancel?: boolean;
}

export default function TagsViewWindow(props: Props)
{
	const { translate } = useTranslations();
	const { state, createTag, renameTag, deleteTag, reorderTags } = useBoardsContext();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();

	const tagsContainerRef = useRef<HTMLDivElement>(null);

	const boardId = props.boardId;
	const boardTags = state.boards[boardId]?.tags ?? {};

	const tagsCountLastDigit = parseInt(Object.keys(boardTags).length.toString().slice(-1));
	const tagsCountLast2Digits = parseInt(Object.keys(boardTags).length.toString().slice(-2));

	const tagsCountTranslationKey: TranslationKey =
		tagsCountLastDigit === 1 && tagsCountLast2Digits !== 11 ? "tags_count_one"
		: (tagsCountLastDigit > 0 && tagsCountLastDigit < 5) && (tagsCountLast2Digits < 11 || tagsCountLast2Digits > 14) ? "tags_count_two_three_four"
		: "tags_count_multiple";

	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	const onTagCreateDialog = () =>
	{
		openPromptDialog(
		{
			title: translate("create_a_new_tag"),
			description: `${translate("enter_a_tag_name")}\.\n${translate("max_length_is")} ${MAX_TAG_TITLE_LENGTH}`,
			initialValue: translate("new_tag"),
			maxLength: MAX_TAG_TITLE_LENGTH,
			validate: v => isNewTagTitleValid(v.trim()),
			onConfirm: result => createTag(boardId, result.trim())
		});
	};

	const onTagRenameDialog = (currentTitle: string, tagId: Id) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_tag"),
			description: `${translate("enter_a_new_tag_name")}\.\n${translate("max_length_is")} ${MAX_TAG_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_TAG_TITLE_LENGTH,
			validate: v => isNewTagTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameTag(boardId, tagId, result.trim())
		});
	};

	const onTagDeleteDialog = (tagId: Id) =>
	{
		openDialog(
		{
			title: translate("delete_the_tag"),
			description: `${translate("are_you_sure_delete_the_tag")} "${boardTags[tagId]?.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: ButtonVariant.Negative,
			onConfirm: () => deleteTag(boardId, tagId)
		});
	};

	const onTagContextMenu = (tag: Tag, triggerButtonRect: DOMRect, options: ('rename' | 'color' | 'delete')[] = ['rename', 'color', 'delete']) =>
	{
		openContextMenu(
		{
			children: <>
			{
				options.includes('rename') &&
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => onTagRenameDialog(tag.title, tag.id)}>
						<SVG name="edit"/>
						{translate("rename")}
					</Button>
			}
			{
				options.includes('color') &&
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
						{translate("color")}
					</Button>
			}
			{
				(options.includes('delete') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('delete') &&
					<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={() => onTagDeleteDialog(tag.id)}>
						<SVG name="delete"/>
						{translate("delete")}
					</Button>
			}
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<>
			<span className={styles.overlay} onClick={props.canBackdropCancel !== false ? onCancel : undefined}/>

			<div className={`${styles.container} ${props.className || ''}`}>
				<div className={styles.headerContainer}>
					<h4>{translate("manage_board_tags")}</h4>
					<p className={styles.tagsCountText}>{Object.keys(boardTags).length} {translate(tagsCountTranslationKey)}</p>
				</div>

				<DragDropProvider onDragEnd={({ operation }) =>
				{
					const { source } = operation;
					if (!isSortable(source)) return;

					const { index, initialIndex } = source;
					if (index === initialIndex) return;

					reorderTags(boardId, source.id as Id, index);
				}}>
					<div className={`${styles.tagsContainer} maskedVerticalScrollContainer`} ref={tagsContainerRef}>
					{
						Object.values(boardTags).map((tag, index) =>
							<KanbanTag key={`tag-${tag.id}`} container={tagsContainerRef} sortableIndex={index}
								tag={tag} large onContextMenu={e => onTagContextMenu(tag, e.currentTarget.getBoundingClientRect())}/>)
					}
					</div>
				</DragDropProvider>

				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small dimmed onClick={onTagCreateDialog}>
					<SVG name="plus"/>
					{translate("create_a_new_tag")}
				</Button>
			</div>
		</>
	);
}