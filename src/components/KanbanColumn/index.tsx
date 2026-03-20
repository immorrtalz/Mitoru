import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './KanbanColumn.module.scss';

import Button, { ButtonType } from '../Button';
import { SVG } from '../SVG';
import KanbanTask from '../KanbanTask';

import BoardsContext from '../../context/BoardsContext';

import useTranslations, { TranslationKey } from '../../hooks/useTranslations';
import { Color, getNextId } from '../../misc/utils';
import { Task } from '../../misc/boards';

interface Props
{
	id: number;
	className?: string;
}

export default function KanbanColumn(props: Props)
{
	const navigate = useNavigate();
	const { translate } = useTranslations();
	const { boards, setBoards, currentBoardId } = useContext(BoardsContext);

	const board = boards.find(board => board.id === currentBoardId)!;

	useEffect(() =>
	{
		if (board === undefined) navigate('/');
	}, [board, navigate]);

	if (board === undefined) return null;

	const column = board.columns.find(column => column.id === props.id)!;

	const tasksCountLastDigit = parseInt(column.tasksIds.length.toString().slice(-1));
	const tasksCountLast2Digits = parseInt(column.tasksIds.length.toString().slice(-2));

	const tasksCountTranslationKey: TranslationKey =
		tasksCountLastDigit === 1 && tasksCountLast2Digits !== 11 ? "tasks_count_one"
		: (tasksCountLastDigit > 0 && tasksCountLastDigit < 5) && (tasksCountLast2Digits < 11 || tasksCountLast2Digits > 14) ? "tasks_count_two_three_four"
		: "tasks_count_multiple";

	const createNewTask = () =>
	{
		const newId = getNextId(board.tasks.map(task => task.id));

		const newTask: Task =
		{
			id: newId,
			title: `${translate("task")} ${newId}`,
			color: { h: 0, s: 0, b: 0, a: 0 } as Color,
			isCompleted: false,
			tagsIds: [],
			text: "",
			checklistsIds: []
		};

		setBoards(boards.map(item =>
		{
			if (item.id !== board.id) return item;

			return {
				...item,
				columns: item.columns.map(column =>
				{
					if (column.id !== props.id) return column;
					return {
						...column,
						tasksIds: [...column.tasksIds, newId]
					};
				}),
				tasks: [...item.tasks, newTask]
			};
		}));
	};

	return (
		<div className={`${styles.kanbanColumn} ${props.className || ''}`}>
			<div className={styles.columnHeader}>
				<div className={styles.columnHeaderTexts}>
					<h6 className={styles.columnTitleText}>{column.title}</h6>
					<p className={styles.columnTasksCountText}>{column.tasksIds.length} {translate(tasksCountTranslationKey)}</p>
				</div>

				<Button type={ButtonType.Small} square onClick={createNewTask}><SVG name='plus'/></Button>
				<Button type={ButtonType.Small} square><SVG name='menuDots'/></Button>
			</div>

			{
				column.tasksIds.map(taskId => (<KanbanTask key={`task-${taskId}`} id={taskId}/>))
			}
		</div>
	);
}