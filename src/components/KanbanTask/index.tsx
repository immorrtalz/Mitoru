import { useContext } from 'react';
import styles from './KanbanTask.module.scss';

import Button, { ButtonType } from '../Button';
import { SVG } from '../SVG';

import BoardsContext from '../../context/BoardsContext';
import useTranslations from '../../hooks/useTranslations';

interface Props
{
	id: number;
	className?: string;
}

export default function KanbanTask(props: Props)
{
	const { translate } = useTranslations();
	const { boards, currentBoardId } = useContext(BoardsContext);

	const board = boards.find(board => board.id === currentBoardId)!;
	const task = board.tasks.find(task => task.id === props.id)!;

	return (
		<div className={`${styles.kanbanTask} ${props.className || ''}`}>
			<div className={styles.taskHeader}>
				<Button type={ButtonType.Small} square><SVG name='cross'/></Button>
				<p className={styles.taskHeaderText}>{task.title}</p>
				<Button type={ButtonType.Small} square><SVG name='menuDots'/></Button>
			</div>

			{
				task.tagsIds.length > 0 &&
					<div className={styles.taskTags}>{task.tagsIds}</div>
			}

			{
				task.checklistsIds.length > 0 &&
					<div className={styles.taskChecklistsProgress}>
						<div className={styles.taskChecklistsProgressBar}/>
						<p className={styles.taskChecklistsProgressText}>0/0</p>
					</div>
			}
		</div>
	);
}