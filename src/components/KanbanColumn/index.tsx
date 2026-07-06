import styles from './KanbanColumn.module.scss';

import Button, { ButtonType } from '../Button';
import { SVG } from '../SVG';
import KanbanTask from '../KanbanTask';

import { useBoardsContext } from '../../context/BoardsContext';

import useTranslations, { TranslationKey } from '../../hooks/useTranslations';
import { Board, Column, Id } from '../../hooks/useKanban';
import { isNewColumnTitleValid, MAX_COLUMN_TITLE_LENGTH } from '../../misc/boards';
import useDialog from '../../hooks/useDialog';

interface Props
{
	board: Board;
	column: Column;
	className?: string;
}

export default function KanbanColumn(props: Props)
{
	const { translate } = useTranslations();
	const { renameColumn, createTask } = useBoardsContext();
	const { openPromptDialog } = useDialog();

	const columnTaskIds = props.board.tasksOrderInColumn[props.column.id] ?? [];

	const tasksCountLastDigit = parseInt(columnTaskIds.length.toString().slice(-1));
	const tasksCountLast2Digits = parseInt(columnTaskIds.length.toString().slice(-2));

	const tasksCountTranslationKey: TranslationKey =
		tasksCountLastDigit === 1 && tasksCountLast2Digits !== 11 ? "tasks_count_one"
		: (tasksCountLastDigit > 0 && tasksCountLastDigit < 5) && (tasksCountLast2Digits < 11 || tasksCountLast2Digits > 14) ? "tasks_count_two_three_four"
		: "tasks_count_multiple";

	const onColumnRenameDialog = (id: Id, currentTitle: string) =>
	{
		openPromptDialog(
		{
			title: translate("rename_the_column"),
			description: `${translate("enter_new_column_name")}\.\n${translate("max_length_is")} ${MAX_COLUMN_TITLE_LENGTH}`,
			confirmTitle: translate('rename'),
			initialValue: currentTitle,
			maxLength: MAX_COLUMN_TITLE_LENGTH,
			validate: v => isNewColumnTitleValid(v.trim(), currentTitle),
			onConfirm: result => renameColumn(props.board.id, props.column.id, result.trim())
		});
	};

	const createNewTask = () =>
	{
		const taskNumber = columnTaskIds.length + 1;
		createTask(props.board.id, props.column.id, `${translate("task")} ${taskNumber}`);
	};

	return (
		<div className={`${styles.kanbanColumn} ${props.className || ''}`}>
			<div className={styles.columnHeader}>
				<div className={styles.columnHeaderTexts}>
					<h6 className={styles.columnTitleText}>{props.column.title}</h6>
					<p className={styles.columnTasksCountText}>{columnTaskIds.length} {translate(tasksCountTranslationKey)}</p>
				</div>

				<Button type={ButtonType.SimpleSecondary} small square onClick={() => onColumnRenameDialog(props.column.id, props.column.title)}><SVG name='edit'/></Button>
				<Button type={ButtonType.SimpleSecondary} small square onClick={createNewTask}><SVG name='plus'/></Button>
				<Button type={ButtonType.SimpleSecondary} small square><SVG name='menuDots'/></Button>
			</div>

			{
				columnTaskIds.map(taskId =>
				{
					const task = props.board.tasks[taskId];
					if (!task) return null;
					return <KanbanTask key={`task-${taskId}`} task={task}/>;
				})
			}
		</div>
	);
}