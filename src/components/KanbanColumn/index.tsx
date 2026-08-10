import { useRef } from 'react';
import styles from './KanbanColumn.module.scss';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
import KanbanTask from '../KanbanTask';
import Separator from '../Separator';
import { SVG } from '../SVG';

import useTranslations, { TranslationKey } from '../../hooks/useTranslations';
import { Column, Id, Tag, Task } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';

import { useBoardsContext } from '../../context/BoardsContext';

import { isNewColumnTitleValid, MAX_COLUMN_TITLE_LENGTH } from '../../misc/boards';
import { HorizontalAlign, Orientation, DND_TRANSITION } from '../../misc/utils';

interface Props
{
	container: React.RefObject<HTMLDivElement | null>;
	sortableIndex: number;
	boardId: Id;
	column: Column;
	tasks: Task[];
	tags: Record<Id, Tag>;
	className?: string;
}

export default function KanbanColumn(props: Props)
{
	const boardId = props.boardId;
	const column = props.column;
	const tasks = props.tasks;
	const tags = props.tags;

	const { translate } = useTranslations();
	const { renameColumn, deleteColumn, createTask } = useBoardsContext();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();
	const { ref, isDragging } = useSortable(
	{
		id: column.id,
		index: props.sortableIndex,
		type: 'column',
		accept: ['column'],
		collisionPriority: CollisionPriority.Low,
		modifiers: [
			RestrictToHorizontalAxis,
			RestrictToElement.configure({ element: () => props.container.current })],
		transition: DND_TRANSITION
	});

	const { ref: taskDropRef } = useDroppable(
	{
		id: `column-drop-${column.id}`,
		type: 'column',
		accept: ['task'],
		collisionPriority: CollisionPriority.Low
	});

	const tasksContainerRef = useRef<HTMLDivElement>(null);

	const setTasksContainerRef = (node: HTMLDivElement | null) =>
	{
		tasksContainerRef.current = node;
		taskDropRef(node);
	};

	const tasksCountLastDigit = parseInt(tasks.length.toString().slice(-1));
	const tasksCountLast2Digits = parseInt(tasks.length.toString().slice(-2));

	const tasksCountTranslationKey: TranslationKey =
		tasksCountLastDigit === 1 && tasksCountLast2Digits !== 11 ? "tasks_count_one"
		: (tasksCountLastDigit > 0 && tasksCountLastDigit < 5) && (tasksCountLast2Digits < 11 || tasksCountLast2Digits > 14) ? "tasks_count_two_three_four"
		: "tasks_count_multiple";

	const onColumnRenameDialog = (currentTitle: string) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_column"),
			description: `${translate("enter_a_new_column_name")}\.\n${translate("max_length_is")} ${MAX_COLUMN_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_COLUMN_TITLE_LENGTH,
			validate: v => isNewColumnTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameColumn(boardId, column.id, result.trim())
		});
	};

	const onColumnDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_column"),
			description: `${translate("are_you_sure_delete_the_column")} "${column.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmButtonVariant: ButtonVariant.Negative,
			onConfirm: () => deleteColumn(boardId, column.id)
		});
	};

	const createNewTask = () =>
	{
		const taskNumber = tasks.length + 1;
		createTask(boardId, column.id, `${translate("task")} ${taskNumber}`);
	};

	const onColumnContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: <>
				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
					onClick={createNewTask}>
					<SVG name="plus"/>
					{translate("create_a_new_task")}
				</Button>

				<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>

				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
					onClick={() => onColumnRenameDialog(column.title)}>
					<SVG name="edit"/>
					{translate("rename")}
				</Button>

				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
					{translate("color")}
				</Button>

				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
					{translate("duplicate")}
				</Button>

				<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>

				<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onColumnDeleteDialog}>
					<SVG name="delete"/>
					{translate("delete")}
				</Button>
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<div className={`${styles.kanbanColumn} ${props.className || ''} ${isDragging ? styles.dragging : ''}`} ref={ref}>
			<div className={styles.columnHeader}>
				<div className={styles.columnHeaderTexts}>
					<h6 className={styles.columnTitleText}>{column.title}</h6>
					<p className={styles.columnTasksCountText}>{tasks.length} {translate(tasksCountTranslationKey)}</p>
				</div>

				<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => onColumnContextMenu(e.currentTarget.getBoundingClientRect())}><SVG name='menuDots'/></Button>
			</div>

			<div className={`${styles.tasksContainer} maskedVerticalScrollContainer`} ref={setTasksContainerRef}>
			{
				tasks.map((task, index) =>
					<KanbanTask key={`task-${column.id}-${task.id}`} container={props.container} sortableIndex={index}
						boardId={boardId} columnId={column.id} task={task} tags={tags}/>)
			}
			</div>

			<Button className={styles.addTaskButton} buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} dimmed
				onClick={createNewTask}>
				<SVG name="plus"/>
				{translate("create_a_new_task")}
			</Button>
		</div>
	);
}