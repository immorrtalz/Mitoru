import { TextBox } from '../TextBox';
import styles from './BoardItem.module.scss';

interface Props
{
	title: string;
	onClick?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
}

export default function BoardItem(props: Props)
{
	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();
	const onClick = (e: React.MouseEvent<HTMLElement>) => props.onClick?.(e);

	return (
		<div className={`${styles.boardItem} ${props.className || ''}`} onClick={onClick}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			<p className={styles.title}>{props.title}</p>
			{props.children}
		</div>
	);
}