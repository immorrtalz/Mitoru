import { useState } from 'react';
import styles from './KanbanChecklistItem.module.scss';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
import { TextBox, TextBoxStyle } from '../TextBox';
import Checkbox, { CheckboxType } from '../Checkbox';
import { SVG } from '../SVG';

import useTranslations from '../../hooks/useTranslations';
import { Id } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';

import { useBoardsContext } from '../../context/BoardsContext';

import { isNewChecklistTitleValid } from '../../misc/boards';
import { DND_TRANSITION } from '../../misc/utils';

interface Props
{
	container: React.RefObject<HTMLDivElement | null>;
	sortableIndex: number;
	boardId: Id;
	taskId: Id;
	checklistId: Id;
	checklistItemId: Id;
	className?: string;
}

export default function KanbanChecklistItem(props: Props)
{
	const { translate } = useTranslations();
	const { state, renameChecklistItem, deleteChecklistItem, toggleChecklistItem } = useBoardsContext();
	const { openDialog } = useDialog();

	const boardId = props.boardId;
	const task = state.boards[boardId]?.tasks[props.taskId];
	const checklist = task.checklistsOrder.map(id => task.checklists[id]).find(c => c.id === props.checklistId);
	if (!checklist) return null;

	const checklistItem = checklist.itemsOrder.map(id => checklist.items[id]).find(c => c.id === props.checklistItemId);
	if (!checklistItem) return null;

	const [titleResetToken, setTitleResetToken] = useState(0);

	const { ref, handleRef } = useSortable(
	{
		id: checklistItem.id,
		index: props.sortableIndex,
		modifiers: [
			RestrictToVerticalAxis,
			RestrictToElement.configure({ element: () => props.container.current })],
		transition: DND_TRANSITION
	});

	const onChecklistItemDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_checklist_item"),
			description: `${translate("are_you_sure_delete_the_checklist_item")} "${checklistItem.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: ButtonVariant.Negative,
			onConfirm: () => deleteChecklistItem(boardId, task.id, checklist.id, checklistItem.id)
		});
	};

	return (
		<div className={`${styles.kanbanChecklistItem} ${props.className || ''}`} ref={ref}>
			<div className={styles.dragHandle} ref={handleRef}>
				<SVG name="drag"/>
			</div>

			<Checkbox type={CheckboxType.Simple} small checked={checklistItem.isCompleted}
				onClick={e => e.stopPropagation()}
				onChange={() => toggleChecklistItem(boardId, task.id, checklist.id, checklistItem.id)}/>

			<TextBox
				key={`checklist-item-title-${titleResetToken}`}
				className={styles.checklistItemHeaderText}
				textBoxStyle={TextBoxStyle.Ghost}
				placeholder={`${translate("input_incentive")}...`}
				variant="wrap"
				value={checklistItem.title}
				onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
				{
					const value = e.target.value.trim();

					if (isNewChecklistTitleValid(value, checklist.title))
						renameChecklistItem(boardId, task.id, checklist.id, checklistItem.id, value);
					else setTitleResetToken(t => t + 1);
				}}/>

			<Button className={styles.deleteButton} buttonStyle={ButtonStyle.Ghost} variant={ButtonVariant.Negative} small square dimmed
				onClick={onChecklistItemDeleteDialog}>
				<SVG name='delete'/>
			</Button>
		</div>
	);
}