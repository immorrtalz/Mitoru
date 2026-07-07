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

export enum ButtonAlignType
{
	Left,
	Center,
	Right
}

interface Props
{
	type: ButtonType;
	align?: ButtonAlignType;
	children?: ReactElement | ReactElement[] | (ReactElement | string)[] | string;
	square?: boolean;
	small?: boolean;
	dimmed?: boolean;
	smallSVG?: boolean;
	dimmedSVG?: boolean;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	onHover?: (...args: any[]) => any;
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

	const onHover = (e: React.MouseEvent<HTMLElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onHover?.(e);
	};

	const typeStyles = [styles.primary, styles.secondary, styles.simpleSecondary, styles.positive, styles.negative];
	const typeStyle = typeStyles[props.type];

	const alignTypeStyles = [styles.leftAligned, styles.centerAligned, styles.rightAligned];
	const alignTypeStyle = alignTypeStyles[props.align ?? ButtonAlignType.Center];

	return (
		<button className={`${styles.button} ${typeStyle} ${alignTypeStyle} ${props.square ? styles.square : ''} ${props.small ? styles.small : ''} ${props.dimmed ? styles.dimmed : ''} ${props.smallSVG ? styles.smallSVG : ''} ${props.dimmedSVG ? styles.dimmedSVG : ''} ${props.className || ''}`}
			onClick={onClick}
			disabled={props.disabled}
			onPointerEnter={onHover}
			onPointerDown={stopPropagation}
			onPointerUp={stopPropagation}>
			{ typeof props.children === "string" ? <span className={styles.text}>{props.children}</span> : props.children }
		</button>
	);
}