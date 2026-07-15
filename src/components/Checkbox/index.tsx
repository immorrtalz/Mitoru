import { SVG } from '../SVG';
import styles from './Checkbox.module.scss';

export enum CheckboxType
{
	Default,
	Simple
}

interface Props
{
	type?: CheckboxType;
	small?: boolean;
	dimmed?: boolean;
	checked?: boolean;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	onChange?: (...args: any[]) => any;
	className?: string;
}

export default function Checkbox(props: Props)
{
	const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();

	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onClick?.(e);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		e.stopPropagation();
		if (!props.disabled) props.onChange?.(e);
	};

	const typeStyles = [styles.default, styles.simple];
	const typeStyle = typeStyles[props.type ?? 0];

	return (
		<div className={`${styles.checkbox} ${typeStyle} ${props.small ? styles.small : ''} ${props.dimmed ? styles.dimmed : ''} ${props.className || ''}`}>
			<input type="checkbox"
				onClick={onClick}
				onChange={onChange}
				{...(props.checked !== undefined ? { checked: props.checked } : {})}
				disabled={props.disabled}
				onPointerEnter={stopPropagation}
				onPointerDown={stopPropagation}
				onPointerUp={stopPropagation}/>
			<SVG name="checkmark"/>
		</div>
	);
}