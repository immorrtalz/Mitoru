import styles from './KanbanTag.module.scss';

interface Props
{
	title: string;
	large?: boolean;
	className?: string;
}

export default function KanbanTag(props: Props)
{
	return (
		<div className={`${styles.kanbanTag} ${props.className || ''} ${props.large ? styles.large : ''}`}>
			<p className={styles.tagText}>{props.title}</p>
		</div>
	);
}