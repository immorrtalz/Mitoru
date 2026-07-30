import { useEffect, useState } from 'react';
import { names, SVG } from '../SVG';
import styles from './TextBox.module.scss';

export enum TextBoxStyle
{
	Default,
	Ghost
}

interface Props
{
	textBoxStyle?: TextBoxStyle;
	svgIconName?: typeof names[number];
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	variant?: 'singleline' | 'wrap' | 'multiline' | 'multiline';
	resizable?: boolean;
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
	const onInput = (e: React.InputEvent<HTMLInputElement | HTMLTextAreaElement>) =>
	{
		let v = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
		if (props.variant === 'wrap') v = v.replace(/\r?\n/g, '');
		setValue(v);
		props.onInput?.(e);
	};

	const onEditingEnded = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
	{
		setValue((e.target as HTMLInputElement | HTMLTextAreaElement).value);
		props.onEditingEnded?.(e);
	};

	const onEnterPressed = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) =>
	{
		props.onEnterPressed?.(e);
	};

	const onEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) =>
	{
		if (e.key === 'Enter' && !(props.variant === 'multiline' && e.shiftKey))
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

	const textBoxStyles = ['', styles.ghost];
	const textBoxStyle = textBoxStyles[props.textBoxStyle ?? TextBoxStyle.Default];

	return (
		<div className={`textBox ${styles.container} ${textBoxStyle} ${props.className || ''} ${props.variant === 'wrap' || props.variant === 'multiline' ? styles.multiline : ""} ${props.resizable === true ? styles.resizable : ""}`}>
			{ props.svgIconName && <SVG className={styles.icon} name={props.svgIconName}/> }
		{
			props.variant === 'wrap' || props.variant === 'multiline' ?
				<textarea
					className={`${styles.textBox} ${props.svgIconName ? styles.withIcon : ""}`}
					placeholder={props.placeholder}
					minLength={props.minLength}
					maxLength={props.maxLength}
					onInput={onInput}
					onBlur={onEditingEnded}
					onKeyDown={onEnterKeyDown}
					disabled={props.disabled}
					value={value}
					autoFocus={props.autofocus}
					spellCheck={false}/>
				: <input type="text"
					className={`${styles.textBox} ${props.svgIconName ? styles.withIcon : ""}`}
					placeholder={props.placeholder}
					minLength={props.minLength}
					maxLength={props.maxLength}
					onInput={onInput}
					onBlur={onEditingEnded}
					onKeyDown={onEnterKeyDown}
					disabled={props.disabled}
					value={value}
					autoFocus={props.autofocus}
					spellCheck={false}/>
		}
		</div>);
}