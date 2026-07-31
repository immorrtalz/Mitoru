import styles from './KanbanTask.module.scss';

import Button, { ButtonStyle, ButtonVariant } from '../Button';
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

import { HorizontalAlign, Orientation } from '../../misc/utils';
import { isNewTaskTitleValid, MAX_TASK_TITLE_LENGTH } from '../../misc/boards';

interface Props
{
	boardId: Id;
	task: Task;
	tags: Record<Id, Tag>;
	className?: string;
	onClick?: (...args: any[]) => any;
}

export default function KanbanTask(props: Props)
{
	const { translate } = useTranslations();
	const { state, toggleTaskCompleted, renameTask, deleteTask, createTagToTask, removeTagFromTask } = useBoardsContext();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();
	const { openTaskView } = useTaskView();

	const boardId = props.boardId;
	const task = props.task;
	const tags = props.tags;
	const taskTags = task.tagsIds.map(id => props.tags[id]).filter(Boolean);
	const boardTags = state.boards[boardId]?.tags ?? {};

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
			confirmButtonVariant: ButtonVariant.Negative,
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
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => onTaskRenameDialog(task.title)}>
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
				options.includes('duplicate') &&
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG disabled>
						{translate("duplicate")}
					</Button>
			}
			{
				(options.includes('tags') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('tags') &&
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => onTaskTagsContextMenu(triggerButtonRect)}>
						{translate("tags")}
					</Button>
			}
			{
				(options.includes('delete') && options.length > 1) &&
					<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>
			}
			{
				options.includes('delete') &&
					<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onTaskDeleteDialog}>
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
		// ADD COLORS OF TAGS
		openContextMenu(
		{
			children: <>
			{
				Object.values(boardTags).map(tag =>
					<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => task.tagsIds.includes(tag.id) ? removeTagFromTask(boardId, task.id, tag.id) : createTagToTask(boardId, task.id, tag.id)}>
						<SVG name={task.tagsIds.includes(tag.id) ? 'checkmark' : 'empty'}/>
						{tag.title}
					</Button>)
			}
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<div className={`${styles.kanbanTask} ${props.className || ''}`} onClick={onClick}>
			<div className={styles.taskHeader}>
				<Checkbox type={CheckboxType.Simple} small checked={task.isCompleted}
					onClick={e => e.stopPropagation()}
					onChange={() => toggleTaskCompleted(boardId, task.id)}/>

				<p className={styles.taskHeaderText}>{task.title}</p>

				<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => onTaskContextMenu(e.currentTarget.getBoundingClientRect())}>
					<SVG name='menuDots'/>
				</Button>
			</div>

		{
			task.tagsIds.length > 0 &&
				<div className={styles.taskTagsContainer}>
				{ taskTags.map(tag => <KanbanTag key={tag.id} title={tag.title}/>) }
				</div>
		}
		</div>
	);
}