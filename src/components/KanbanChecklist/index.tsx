import { useRef, useState } from 'react';
import styles from './KanbanChecklist.module.scss';
import { DragDropProvider } from '@dnd-kit/react';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
import { TextBox, TextBoxStyle } from '../TextBox';
import KanbanChecklistItem from '../KanbanChecklistItem';
import Separator from '../Separator';
import { SVG } from '../SVG';

import useTranslations, { TranslationKey } from '../../hooks/useTranslations';
import { Id } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';

import { useBoardsContext } from '../../context/BoardsContext';

import { HorizontalAlign, Orientation, DND_TRANSITION } from '../../misc/utils';
import { isNewChecklistTitleValid } from '../../misc/boards';

interface Props
{
	container: React.RefObject<HTMLDivElement | null>;
	sortableIndex: number;
	boardId: Id;
	taskId: Id;
	checklistId: Id;
	className?: string;
}

export default function KanbanChecklist(props: Props)
{
	const { translate } = useTranslations();
	const { state, renameChecklist, deleteChecklist, createChecklistItem, reorderChecklistItems } = useBoardsContext();
	const { openDialog } = useDialog();
	const { openContextMenu } = useContextMenu();

	const boardId = props.boardId;
	const task = state.boards[boardId]?.tasks[props.taskId];
	const checklist = task.checklistsOrder.map(id => task.checklists[id]).find(c => c.id === props.checklistId);

	if (!checklist) return null;

	const [titleResetToken, setTitleResetToken] = useState(0);

	const checklistItemsCountLastDigit = parseInt(checklist.itemsOrder.length.toString().slice(-1));
	const checklistItemsCountLast2Digits = parseInt(checklist.itemsOrder.length.toString().slice(-2));

	const checklistItemsCountTranslationKey: TranslationKey =
		checklistItemsCountLastDigit === 1 && checklistItemsCountLast2Digits !== 11 ? "checklist_items_count_one"
		: (checklistItemsCountLastDigit > 0 && checklistItemsCountLastDigit < 5) && (checklistItemsCountLast2Digits < 11 || checklistItemsCountLast2Digits > 14) ? "checklist_items_count_two_three_four"
		: "checklist_items_count_multiple";

	const checklistItemsContainerRef = useRef<HTMLDivElement>(null);

	const { ref, handleRef, isDragging } = useSortable(
	{
		id: checklist.id,
		index: props.sortableIndex,
		modifiers: [
			RestrictToVerticalAxis,
			RestrictToElement.configure({ element: () => props.container.current })],
		transition: DND_TRANSITION
	});

	const onChecklistDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_checklist"),
			description: `${translate("are_you_sure_delete_the_checklist")} "${checklist.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: ButtonVariant.Negative,
			onConfirm: () => deleteChecklist(boardId, task.id, checklist.id)
		});
	};

	const onChecklistContextMenu = (triggerButtonRect: DOMRect, options: ('duplicate' | 'delete')[] = ['duplicate', 'delete']) =>
	{
		openContextMenu(
		{
			children: <>
			{
				options.includes('duplicate') &&
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
						<SVG name="copy"/>
						{translate("duplicate")}
					</Button>
			}
			{
				(options.includes('delete') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('delete') &&
					<Button buttonStyle={ButtonStyle.Ghost} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onChecklistDeleteDialog}>
						<SVG name="delete"/>
						{translate("delete")}
					</Button>
			}
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	const createNewChecklistItem = () =>
	{
		const checklistItemNumber = checklist.itemsOrder.length + 1;
		createChecklistItem(boardId, task.id, checklist.id, `${translate("checklist_item")} ${checklistItemNumber}`);
	};

	return (
		<div className={`${styles.kanbanChecklist} ${props.className || ''} ${isDragging ? styles.dragging : ''}`} ref={ref}>
			<div className={styles.dragHandle} ref={handleRef}>
				<SVG name="drag"/>
			</div>

			<div className={styles.checklistHeader}>
				<div className={styles.checklistHeaderTexts}>
					<TextBox
						key={`checklist-title-${titleResetToken}`}
						className={styles.checklistHeaderText}
						textBoxStyle={TextBoxStyle.Ghost}
						placeholder={`${translate("input_incentive")}...`}
						variant="wrap"
						value={checklist.title}
						onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						{
							const value = e.target.value.trim();

							if (isNewChecklistTitleValid(value, checklist.title))
								renameChecklist(boardId, task.id, checklist.id, value);
							else setTitleResetToken(t => t + 1);
						}}/>

					<p className={styles.checklistItemsCountText}>{checklist.itemsOrder.length} {translate(checklistItemsCountTranslationKey)}</p>
				</div>

				<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => onChecklistContextMenu(e.currentTarget.getBoundingClientRect())}>
					<SVG name='menuDots'/>
				</Button>
			</div>

			<DragDropProvider onDragEnd={({ operation }) =>
			{
				const { source } = operation;
				if (!isSortable(source)) return;

				const { index, initialIndex } = source;
				if (index === initialIndex) return;

				reorderChecklistItems(boardId, task.id, checklist.id, source.id as Id, index);
			}}>
				<div className={styles.checklistItemsContainer} ref={checklistItemsContainerRef}>
				{
					checklist.itemsOrder.map((checklistItemId, index) =>
					{
						const checklistItem = checklist.items[checklistItemId];

						return <KanbanChecklistItem
							key={checklistItem.id}
							container={checklistItemsContainerRef}
							sortableIndex={index}
							boardId={boardId}
							taskId={task.id}
							checklistId={checklist.id}
							checklistItemId={checklistItem.id}/>;
					})
				}
				</div>
			</DragDropProvider>

			<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small dimmed
				onClick={createNewChecklistItem}>
				<SVG name="plus"/>
				{translate("create_a_new_checklist_item")}
			</Button>
		</div>
	);
}