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

import { useBoardsContext } from '../../context/BoardsContext';

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
	const boardId = props.boardId;
	const task = props.task;
	const taskTags = task.tagsIds.map(id => props.tags[id]).filter(Boolean);

	const onClick = (e: React.MouseEvent<HTMLElement>) => props.onClick?.(e);

	const { translate } = useTranslations();
	const { toggleTaskCompleted, renameTask, deleteTask } = useBoardsContext();
	const { openDialog, openPromptDialog } = useDialog();
	const { openContextMenu } = useContextMenu();

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
			onConfirm: () => deleteTask(boardId, task.id)
		});
	};

	const onTaskContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: <>
				<Button buttonStyle={ButtonStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
					onClick={() => onTaskRenameDialog(task.title)}>
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

				<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} align={HorizontalAlign.Left} small smallSVG onClick={onTaskDeleteDialog}>
					<SVG name="delete"/>
					{translate("delete")}
				</Button>
			</>,
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<div className={`${styles.kanbanTask} ${props.className || ''}`} onClick={onClick}>
			<div className={styles.taskHeader}>
				<Checkbox type={CheckboxType.Simple} small checked={task.isCompleted} onChange={() => toggleTaskCompleted(boardId, task.id)}/>

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