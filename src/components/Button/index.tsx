import { ReactElement } from 'react';
import styles from './Button.module.scss';

export enum ButtonType
{
	Primary,
	Secondary,
	Small
}

interface Props
{
	type: ButtonType;
	children?: ReactElement | ReactElement[] | string;
	square?: boolean;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	className?: string;
}

export default function Button(props: Props)
{
	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onClick?.(e);
	};

	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => { e.stopPropagation(); };

	const typeStyle = props.type === ButtonType.Primary ? styles.primary : props.type === ButtonType.Secondary ? styles.secondary : styles.small;

	return (
		<button className={`${styles.button} ${typeStyle} ${props.square ? styles.square : ''} ${props.className || ''}`} onClick={onClick} disabled={props.disabled}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			{props.children}
		</button>
	);
}