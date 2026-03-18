import { ReactElement } from 'react';
import styles from './Button.module.scss';

export enum ButtonType
{
	Primary,
	Secondary
}

interface Props
{
	type?: ButtonType;
	children?: ReactElement | string;
	square?: boolean;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	className?: string;
}

export function Button(props: Props)
{
	const onClick = (e: React.MouseEvent<HTMLElement>) => props.onClick?.(e);
	var dynamicClassNames: string[] = [];

	switch (props.type)
	{
		case ButtonType.Secondary:
			dynamicClassNames.push(styles.secondaryButton);
			break;

		default: dynamicClassNames.push(styles.primaryButton);
	}

	if (props.square) dynamicClassNames.push(styles.squareButton);

	return (
		<button className={`${styles.button} ${dynamicClassNames.join(' ')} ${props.className || ''} fontSemibold`} onClick={props.disabled ? undefined : onClick} disabled={props.disabled}>
			{props.children}
		</button>
	);
}