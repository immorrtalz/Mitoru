import { useRef } from 'react';
import styles from './KanbanTask.module.scss';
import { RestrictToElement, RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';

import Button from '../Button';
import Checkbox, { CheckboxType } from '../Checkbox';
import Separator from '../Separator';
import { SVG } from '../SVG';
import KanbanTag from '../KanbanTag';

import useTranslations from '../../hooks/useTranslations';
import { Id, Tag, Task } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';
import useTaskView from '../../hooks/useTaskView';

import { useBoardsContext } from '../../context/BoardsContext';
import { TaskViewHandle } from '../../context/TaskViewContext';

import { HorizontalAlign, Orientation, DND_TRANSITION, InteractableStyle, StyleVariant } from '../../misc/utils';
import { isNewTaskTitleValid, MAX_TASK_TITLE_LENGTH } from '../../misc/boards';

interface Props
{
	container: React.RefObject<HTMLDivElement | null>;
	sortableIndex: number;
	boardId: Id;
	columnId: Id;
	task: Task;
	tags: Record<Id, Tag>;
	className?: string;
	onClick?: (...args: any[]) => any;
}

export default function KanbanTask(props: Props)
{
	const { state, toggleTaskCompleted, renameTask, deleteTask, createTagToTask, removeTagFromTask, reorderTaskTags } = useBoardsContext();

	const boardId = props.boardId;
	const task = props.task;
	const tags = props.tags;
	const taskTags = task.tagsIds.map(id => props.tags[id]).filter(Boolean);
	const boardTags = state.boards[boardId]?.tags ?? {};

	const checklistItems = Object.values(task.checklists).flatMap(checklist => Object.values(checklist.items));
	const checklistItemsCount = checklistItems.length;
	const completedChecklistItemsCount = checklistItems.filter(item => item.isCompleted).length;
	const completedChecklistItemsPercentage = checklistItemsCount > 0 ? Math.round((completedChecklistItemsCount / checklistItemsCount) * 100) : 0;

	const { translate } = useTranslations();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();
	const { openTaskView } = useTaskView();
	const { ref, isDragging } = useSortable(
	{
		id: task.id,
		index: props.sortableIndex,
		type: 'task',
		accept: ['task'],
		group: props.columnId,
		modifiers: [
			RestrictToWindow,
			RestrictToElement.configure({ element: () => props.container.current })
		],
		transition: DND_TRANSITION
	});

	const tagsContainerRef = useRef<HTMLDivElement>(null);

	let closeTaskViewWindowHandle: TaskViewHandle | null = null;

	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		closeTaskViewWindowHandle = openTaskView({ boardId, taskId: task.id, tags, onTaskContextMenu });
		props.onClick?.(e);
	};

	const onTaskRenameDialog = (currentTitle: string) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_task"),
			description: `${translate("enter_a_new_task_name")}\.\n${translate("max_length_is")} ${MAX_TASK_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_TASK_TITLE_LENGTH,
			validate: v => isNewTaskTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameTask(boardId, task.id, result.trim())
		});
	};

	const onTaskDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_task"),
			description: `${translate("are_you_sure_delete_the_task")} "${task.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: StyleVariant.Negative,
			onConfirm: () =>
			{
				closeTaskViewWindowHandle?.close();
				deleteTask(boardId, task.id);
			}
		});
	};

	const onTaskContextMenu = (triggerButtonRect: DOMRect, options: ('rename' | 'color' | 'duplicate' | 'tags' | 'delete')[] = ['rename', 'color', 'duplicate', 'tags', 'delete']) =>
	{
		openContextMenu(
		{
			children: <>
			{
				options.includes('rename') &&
					<Button buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => onTaskRenameDialog(task.title)}>
						<SVG name="edit"/>
						{translate("rename")}
					</Button>
			}
			{
				options.includes('color') &&
					<Button buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
						<SVG name="color"/>
						{translate("color")}
					</Button>
			}
			{
				options.includes('duplicate') &&
					<Button buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
						<SVG name="copy"/>
						{translate("duplicate")}
					</Button>
			}
			{
				(options.includes('tags') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('tags') &&
					<Button buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => onTaskTagsContextMenu(triggerButtonRect)}>
						<SVG name="tag"/>
						{translate("tags")}
					</Button>
			}
			{
				(options.includes('delete') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('delete') &&
					<Button buttonStyle={InteractableStyle.Ghost} variant={StyleVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onTaskDeleteDialog}>
						<SVG name="delete"/>
						{translate("delete")}
					</Button>
			}
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	const onTaskTagsContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: <>
			{
				Object.keys(boardTags).length > 0 ? Object.values(boardTags).map(tag =>
					<Button key={tag.id} buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG bgColor={tag.color}
						onClick={() => task.tagsIds.includes(tag.id) ? removeTagFromTask(boardId, task.id, tag.id) : createTagToTask(boardId, task.id, tag.id)}>
						<SVG name={task.tagsIds.includes(tag.id) ? 'checkmark' : 'empty'}/>
						{tag.title}
					</Button>)
					: <Button buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG disabled>
						{translate("no_tags_on_this_board")}
					</Button>
			}
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left },
			width: "fit-content"
		});
	};

	return (
		<div className={`${styles.kanbanTask} ${props.className || ''} ${isDragging ? styles.dragging : ''}`} onClick={onClick} ref={ref}>
			<div className={styles.taskHeader}>
				<Checkbox type={CheckboxType.Simple} small checked={task.isCompleted}
					onClick={e => e.stopPropagation()}
					onChange={() => toggleTaskCompleted(boardId, task.id)}/>

				<p className={styles.taskHeaderText}>{task.title}</p>

				<Button buttonStyle={InteractableStyle.Ghost} small square dimmed onClick={e => onTaskContextMenu(e.currentTarget.getBoundingClientRect())}>
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

			{
				checklistItemsCount > 0 && <div className={styles.checklistsProgressContainer}>
					<div className={styles.checklistsProgressTextsContainer}>
						<p>{completedChecklistItemsCount}/{checklistItemsCount}</p>
						<p>{completedChecklistItemsPercentage}%</p>
					</div>

					<div className={styles.checklistsProgressBar}>
						<div className={styles.checklistsProgressBarFill} style={{ width: `${completedChecklistItemsPercentage}%` }} />
					</div>
				</div>
			}
		</div>
	);
}