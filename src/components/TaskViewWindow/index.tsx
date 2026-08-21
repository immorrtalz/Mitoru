import { useState, useRef } from 'react';
import styles from './TaskViewWindow.module.scss';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from "@dnd-kit/react/sortable";

import Button, { ButtonStyle } from '../Button';
import { TextBox, TextBoxStyle } from '../TextBox';
import Checkbox, { CheckboxType } from '../Checkbox';
import KanbanChecklist from '../KanbanChecklist';
import KanbanTag from '../KanbanTag';
import { SVG } from '../SVG';

import useTranslations from "../../hooks/useTranslations";
import { Id, Tag } from '../../hooks/useKanban';

import { isNewTaskTextValid, isNewTaskTitleValid } from '../../misc/boards';

import { useBoardsContext } from '../../context/BoardsContext';
import { HorizontalAlign } from '../../misc/utils';

interface Props
{
	boardId: Id;
	taskId: Id;
	tags: Record<Id, Tag>;
	className?: string;
	onCancel?: (...args: any[]) => any;
	onTaskContextMenu: (...args: any[]) => any;
	canBackdropCancel?: boolean;
}

export default function TaskViewWindow(props: Props)
{
	const { translate } = useTranslations();
	const { state, toggleTaskCompleted, renameTask, setTaskText, createChecklist, reorderChecklists, reorderTaskTags } = useBoardsContext();

	const tagsContainerRef = useRef<HTMLDivElement>(null);
	const checklistsContainerRef = useRef<HTMLDivElement>(null);

	const boardId = props.boardId;
	const task = state.boards[boardId]?.tasks[props.taskId];
	const taskTags = task.tagsIds.map(id => props.tags[id]).filter(Boolean);

	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	const [titleResetToken, setTitleResetToken] = useState(0);
	const [textResetToken, setTextResetToken] = useState(0);

	const createNewChecklist = () =>
	{
		const checklistNumber = task.checklistsOrder.length + 1;
		createChecklist(boardId, task.id, `${translate("checklist")} ${checklistNumber}`);
	};

	return (
		<>
			<span className={styles.overlay} onClick={props.canBackdropCancel !== false ? onCancel : undefined}/>

			<div className={`${styles.container} ${props.className || ''}`}>
				<div className={styles.headerContainer}>
					<Checkbox type={CheckboxType.Simple} checked={task.isCompleted} onChange={() => toggleTaskCompleted(boardId, task.id)}/>

					<TextBox
						key={`task-title-${titleResetToken}`}
						className={styles.taskHeaderText}
						textBoxStyle={TextBoxStyle.Ghost}
						placeholder={`${translate("input_incentive")}...`}
						variant="wrap"
						value={task.title}
						onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						{
							const value = e.target.value.trim();

							if (isNewTaskTitleValid(value, task.title))
								renameTask(boardId, task.id, value);
							else setTitleResetToken(t => t + 1);
						}}/>

					<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => props.onTaskContextMenu(e.currentTarget.getBoundingClientRect(), ['color', 'duplicate', 'tags', 'delete'])}>
						<SVG name='menuDots'/>
					</Button>
				</div>

				<DragDropProvider onDragEnd={({ operation }) =>
				{
					const { source } = operation;
					if (!isSortable(source)) return;

					const { index, initialIndex } = source;
					if (index === initialIndex) return;

					reorderTaskTags(boardId, task.id, source.id as Id, index);
				}}>
				{
					task.tagsIds.length > 0 &&
						<div className={styles.taskTagsContainer} ref={tagsContainerRef}>
						{ taskTags.map((tag, index) => <KanbanTag key={tag.id} container={tagsContainerRef} sortableIndex={index} tag={tag}/>) }
						</div>
				}
				</DragDropProvider>

				<TextBox
					key={`task-text-${textResetToken}`}
					className={styles.descriptionText}
					textBoxStyle={TextBoxStyle.Default}
					placeholder={`${translate("input_incentive")}...`}
					variant="multiline"
					value={task.text}
					onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					{
						const value = e.target.value;

						if (isNewTaskTextValid(value, task.text))
							setTaskText(boardId, task.id, value);
						else setTextResetToken(t => t + 1);
					}}/>

				<DragDropProvider onDragEnd={({ operation }) =>
				{
					const { source } = operation;
					if (!isSortable(source)) return;

					const { index, initialIndex } = source;
					if (index === initialIndex) return;

					reorderChecklists(boardId, task.id, source.id as Id, index);
				}}>
				{
					task.checklistsOrder.length > 0 &&
						<div className={`${styles.checklistsContainer} maskedVerticalScrollContainer`} ref={checklistsContainerRef}>
						{
							task.checklistsOrder.map((checklistId, index) =>
								<KanbanChecklist key={`checklist-${checklistId}`} container={checklistsContainerRef} sortableIndex={index}
									boardId={boardId} taskId={task.id} checklistId={checklistId}/>)
						}
						</div>
				}
				</DragDropProvider>

				<Button className={styles.newChecklistButton} buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small dimmed onClick={createNewChecklist}>
					<SVG name="plus"/>
					{translate("create_a_new_checklist")}
				</Button>
			</div>
		</>
	);
}