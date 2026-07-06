import { useEffect, useState } from 'react';
import { names, SVG } from '../SVG';
import styles from './TextBox.module.scss';

interface Props
{
	svgIconName?: typeof names[number];
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	disabled?: boolean;
	value?: string;
	onInput?: (...args: any[]) => any;
	onEditingEnded?: (...args: any[]) => any;
	onEnterPressed?: (...args: any[]) => any;
	className?: string;
	autofocus?: boolean;
}

export function TextBox(props: Props)
{
	const onInput = (e: React.InputEvent<HTMLInputElement>) =>
	{
		setValue((e.target as HTMLInputElement).value);
		props.onInput?.(e);
	};

	const onEditingEnded = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		setValue((e.target as HTMLInputElement).value);
		props.onEditingEnded?.(e);
	};

	const onEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) =>
	{
		props.onEnterPressed?.(e);
	};

	const onEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === 'Enter')
		{
			(e.target as HTMLElement).blur();
			onEnterPressed(e);
			e.preventDefault();
		}
	};

	const [value, setValue] = useState(props.value || "");

	useEffect(() =>
	{
		setValue(props.value || "");
	}, [props.value]);

	return (
		<div className={`${styles.container} ${props.className || ''}`}>
			{ props.svgIconName && <SVG className={styles.icon} name={props.svgIconName}/> }
			<input type="text"
				className={`${styles.textBox} ${props.svgIconName ? styles.withIcon : ""}`}
				placeholder={props.placeholder}
				minLength={props.minLength}
				maxLength={props.maxLength}
				onInput={onInput}
				onBlur={onEditingEnded}
				onKeyDown={onEnterKeyDown}
				disabled={props.disabled}
				value={value}
				autoFocus={props.autofocus}/>
		</div>);
}