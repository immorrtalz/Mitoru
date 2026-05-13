import { ReactElement } from 'react';
import styles from './Button.module.scss';

export enum ButtonType
{
	Primary,
	Secondary,
	Small,
	SmallNegative,
	Simple,
	Positive,
	Negative
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
	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();

	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onClick?.(e);
	};

	const typeStyle = props.type === ButtonType.Primary ? styles.primary
		: props.type === ButtonType.Secondary ? styles.secondary
		: props.type === ButtonType.Small ? styles.small
		: props.type === ButtonType.SmallNegative ? styles.smallNegative
		: props.type === ButtonType.Positive ? styles.positive
		: styles.negative;

	return (
		<button className={`${styles.button} ${typeStyle} ${props.square ? styles.square : ''} ${props.className || ''}`} onClick={onClick} disabled={props.disabled}
			onPointerEnter={stopPropagation} onPointerDown={stopPropagation} onPointerUp={stopPropagation}>
			{props.children}
		</button>
	);
}