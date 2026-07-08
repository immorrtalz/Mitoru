import styles from './KanbanTag.module.scss';

interface Props
{
	title: string;
	className?: string;
}

export default function KanbanTag(props: Props)
{
	return (
		<div className={`${styles.kanbanTag} ${props.className || ''}`}>
			<p className={styles.tagText}>{props.title}</p>
		</div>
	);
}