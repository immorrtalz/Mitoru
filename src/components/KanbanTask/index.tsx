import styles from './KanbanTask.module.scss';

import Button, { ButtonType } from '../Button';
import { SVG } from '../SVG';

import { Task } from '../../hooks/useKanban';

interface Props
{
	task: Task;
	className?: string;
}

export default function KanbanTask(props: Props)
{
	const { task } = props;

	return (
		<div className={`${styles.kanbanTask} ${props.className || ''}`}>
			<div className={styles.taskHeader}>
				<Button type={ButtonType.SimpleSecondary} small square><SVG name='cross'/></Button>
				<p className={styles.taskHeaderText}>{task.title}</p>
				<Button type={ButtonType.SimpleSecondary} small square><SVG name='menuDots'/></Button>
			</div>

			{
				task.tagsIds.length > 0 &&
					<div className={styles.taskTags}>{task.tagsIds}</div>
			}
		</div>
	);
}