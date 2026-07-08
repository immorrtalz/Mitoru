import styles from './KanbanTask.module.scss';

import Button, { ButtonAlignType, ButtonType } from '../Button';
import Checkbox, { CheckboxType } from '../Checkbox';
import Separator from '../Separator';
import { SVG } from '../SVG';

import useTranslations from '../../hooks/useTranslations';
import { Id, Tag, Task } from '../../hooks/useKanban';
import useDialog from '../../hooks/useDialog';
import useContextMenu from '../../hooks/useContextMenu';

import { useBoardsContext } from '../../context/BoardsContext';

import { Orientation } from '../../misc/utils';
import KanbanTag from '../KanbanTag';

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
	const { toggleTaskCompleted, deleteTask } = useBoardsContext();
	const { openDialog } = useDialog();
	const { openContextMenu } = useContextMenu();

	const onTaskDeleteDialog = () =>
	{
		openDialog(
		{
			title: translate("delete_the_task"),
			description: `${translate("are_you_sure_delete_the_task")} "${task.title}"?\n${translate("this_action_cannot_be_undone")}.`,
			confirmTitle: translate('delete'),
			confirmType: ButtonType.Negative,
			onConfirm: () => deleteTask(boardId, task.id)
		});
	};

	const onTaskContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: <>
				<Button type={ButtonType.SimpleSecondary} align={ButtonAlignType.Left} small smallSVG dimmedSVG disabled>
					{translate("color")}
				</Button>

				<Button type={ButtonType.SimpleSecondary} align={ButtonAlignType.Left} small smallSVG dimmedSVG disabled>
					{translate("duplicate")}
				</Button>

				<Separator orientation={Orientation.Horizontal} paddingRightOrTop={4} paddingLeftOrBottom={4}/>

				<Button type={ButtonType.Negative} align={ButtonAlignType.Left} small smallSVG dimmedSVG onClick={onTaskDeleteDialog}>
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

				<Button type={ButtonType.SimpleSecondary} small square onClick={e => onTaskContextMenu(e.currentTarget.getBoundingClientRect())}>
					<SVG name='menuDots'/>
				</Button>
			</div>

		{
			task.tagsIds.length > 0 &&
				<div className={styles.taskTagsContainer}>
				{ taskTags.map(tag => <KanbanTag key={tag.id} title={tag.title}/>) }
				</div>
		}
			<div className={styles.taskTagsContainer}>
				<KanbanTag title="Just a tag title"/>
				<KanbanTag title="Meow"/>
				<KanbanTag title="Just a tag title lol"/>
				<KanbanTag title="Lorem ipsum"/>
				<KanbanTag title="Iprem losum"/>
			</div>
		</div>
	);
}