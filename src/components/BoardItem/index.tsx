import styles from './BoardItem.module.scss';
import Button from '../Button';
import { SVG } from '../SVG';

export enum ButtonType
{
	Primary,
	Secondary,
	Small
}

interface Props
{
	title: string;
	onClick?: (...args: any[]) => any;
	className?: string;
}

export default function BoardItem(props: Props)
{
	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		props.onClick?.(e);
	};

	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => { e.stopPropagation(); };

	return (
		<div className={`${styles.boardItem} ${props.className || ''}`} onClick={onClick}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			<p className={styles.title}>{props.title}</p>

			<Button type={ButtonType.Small} square>
				<SVG name='menuDots'/>
			</Button>
		</div>
	);
}