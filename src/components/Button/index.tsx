import { ReactElement, useEffect } from 'react';
import styles from './Button.module.scss';
import { HorizontalAlign } from '../../misc/utils';

export enum ButtonStyle
{
	Primary,
	Secondary,
	Outlined,
	Ghost
}

export enum ButtonVariant
{
	Neutral,
	Positive,
	Negative
}

interface Props
{
	buttonStyle?: ButtonStyle;
	variant?: ButtonVariant;
	align?: HorizontalAlign;
	bgColor?: string;
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
	style?: React.CSSProperties;
}

export default function Button(props: Props)
{
	const children: Array<ReactElement | string> = Array.isArray(props.children) ? props.children : [props.children].filter(c => c !== undefined && c !== null);

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

	const buttonStyles = [styles.primary, styles.secondary, styles.outlined, styles.ghost];
	const buttonStyle = buttonStyles[props.buttonStyle ?? ButtonStyle.Primary];

	const variantStyles = ['', styles.positive, styles.negative];
	const variantStyle = variantStyles[props.variant ?? ButtonVariant.Neutral];

	const alignStyles = [styles.leftAligned, styles.centerAligned, styles.rightAligned];
	const alignStyle = alignStyles[props.align ?? HorizontalAlign.Center];

	return (
		<button className={`${styles.button} ${buttonStyle} ${variantStyle} ${alignStyle} ${props.square ? styles.square : ''} ${props.small ? styles.small : ''} ${props.dimmed ? styles.dimmed : ''} ${props.smallSVG ? styles.smallSVG : ''} ${props.dimmedSVG ? styles.dimmedSVG : ''} ${props.className || ''}`}
			style={props.style}
			{ ...(props.bgColor !== undefined && { "data-bg-color": props.bgColor }) }
			onClick={onClick}
			disabled={props.disabled}
			onPointerEnter={onHover}
			onPointerDown={stopPropagation}
			onPointerUp={stopPropagation}>
		{
			props.children && (children.map((child, index) =>
				typeof child === "string" ?
					<span key={`button-child-${index}`} className={styles.text}>{child}</span>
					: {...child, key: `button-child-${index}`}))
		}
		</button>
	);
}