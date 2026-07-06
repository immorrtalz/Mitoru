import { ReactElement } from 'react';
import styles from './Button.module.scss';

export enum ButtonType
{
	Primary,
	Secondary,
	SimpleSecondary,
	Positive,
	Negative
}

interface Props
{
	type: ButtonType;
	children?: ReactElement | ReactElement[] | string;
	square?: boolean;
	small?: boolean;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	className?: string;
}

export default function Button(props: Props)
{
	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();

	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onClick?.(e);
	};

	const typeStyles = [styles.primary, styles.secondary, styles.simpleSecondary, styles.positive, styles.negative];
	const typeStyle = typeStyles[props.type];

	return (
		<button className={`${styles.button} ${typeStyle} ${props.square ? styles.square : ''} ${props.small ? styles.small : ''} ${props.className || ''}`} onClick={onClick} disabled={props.disabled}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			{props.children}
		</button>
	);
}