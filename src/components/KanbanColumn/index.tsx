import styles from './KanbanColumn.module.scss';
import Button, { ButtonType } from '../Button';
import { SVG } from '../SVG';
import BoardsContext from '../../context/BoardsContext';
import { useContext } from 'react';

interface Props
{
	id?: number;
	boardId?: number;
	className?: string;
}

export default function KanbanColumn(props: Props)
{
	const { boards } = useContext(BoardsContext);

	const board = boards.find(board => board.id === props.boardId);
	const column = board?.columns.find(column => column.id === props.id);

	return (
		<div className={`${styles.kanbanColumn} ${props.className || ''}`}>
			<div className={styles.columnHeader}>
				<div className={styles.columnHeaderTexts}>
					<h6 className={styles.columnTitleText}>{column?.title}</h6>
					<p className={styles.columnTasksCountText}>{column?.tasksIds.length || 0} tasks</p>
				</div>

				<Button type={ButtonType.Small} square><SVG name='plus'/></Button>
				<Button type={ButtonType.Small} square><SVG name='menuDots'/></Button>
			</div>

		</div>
	);
}