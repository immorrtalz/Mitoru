import styles from './KanbanTag.module.scss';
import { SVG } from '../SVG';
import { CollisionPriority } from '@dnd-kit/abstract';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { useSortable } from '@dnd-kit/react/sortable';

import { Tag } from '../../hooks/useKanban';
import Button, { ButtonStyle } from '../Button';
import { DND_TRANSITION } from '../../misc/utils';

interface Props
{
	container: React.RefObject<HTMLDivElement | null>;
	sortableIndex: number;
	tag: Tag;
	large?: boolean;
	className?: string;
	onContextMenu?: (...args: any[]) => any;
}

export default function KanbanTag(props: Props)
{
	const tag = props.tag;

	const { ref, handleRef, isDragging } = useSortable(
	{
		id: tag.id,
		index: props.sortableIndex,
		collisionPriority: CollisionPriority.High,
		modifiers: [
			...(props.large === true ? [RestrictToVerticalAxis] : []),
			RestrictToElement.configure({ element: () => props.container.current })],
		transition: DND_TRANSITION
	});

	return (
		<div className={`${styles.kanbanTag} ${props.className || ''} ${props.large === true ? styles.large : ''} ${isDragging ? styles.dragging : ''}`} ref={ref}>
		{
			(props.large === true) &&
				<div className={styles.dragHandle} ref={handleRef}>
					<SVG name="drag"/>
				</div>
		}
			<p className={styles.tagText}>{tag.title}</p>
		{
			(props.large === true) &&
				<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => props.onContextMenu?.(e)}>
					<SVG name='menuDots'/>
				</Button>
		}
		</div>
	);
}