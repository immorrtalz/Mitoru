import { useEffect, useState } from 'react';
import { names, SVG } from '../SVG';
import styles from './TextBox.module.scss';

interface Props
{
	svgIconName?: typeof names[number];
	placeholder?: string;
	maxLength?: number;
	disabled?: boolean;
	value?: string;
	onInput?: (...args: any[]) => any;
	onEditingEnded?: (...args: any[]) => any;
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

	const onEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === 'Enter') (e.target as HTMLElement).blur();
	};

	const [value, setValue] = useState(props.value || "");

	useEffect(() =>
	{
		setValue(props.value || "");
	}, [props.value]);

	return (
		<div className={styles.container}>
			{ props.svgIconName && <SVG className={styles.icon} name={props.svgIconName}/> }
			<input className={`${styles.textBox} ${props.svgIconName ? styles.withIcon : ""}`} type="text" placeholder={props.placeholder} maxLength={props.maxLength || 50}
				onInput={onInput} onBlur={onEditingEnded} onKeyDown={onEnterKeyDown} disabled={props.disabled} value={value}/>
		</div>);
}