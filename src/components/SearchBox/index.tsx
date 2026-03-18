import { FormEvent, useRef } from 'react';
import { names, SVG } from '../SVG';
import { TextBox } from '../TextBox';
import styles from './SearchBox.module.scss';
import { Button, ButtonType } from '../Button';

interface Props
{
	svgIconName?: typeof names[number];
	placeholder?: string;
	maxLength?: number;
	disabled?: boolean;
	onInput?: (...args: any[]) => any;
	onEditingEnded?: (...args: any[]) => any;
	onSearch?: (...args: any[]) => any;
	children?: React.ReactNode | React.ReactNode[];
	statusText?: string;
}

export function SearchBox(props: Props)
{
	const onInput = (e: FormEvent<HTMLInputElement>) =>
	{
		prevSearchBoxValueRef.current = searchBoxValueRef.current;
		searchBoxValueRef.current = (e.target as HTMLInputElement).value;
		props.onInput?.(e);
	};

	const onEditingEnded = (e: FormEvent<HTMLInputElement>) =>
	{
		if (prevSearchBoxValueRef.current !== searchBoxValueRef.current) onSearch();
		props.onEditingEnded?.(e);
	};

	const onSearch = () =>
	{
		props.onSearch?.(searchBoxValueRef.current);
	};

	const searchBoxValueRef = useRef<string>("");
	const prevSearchBoxValueRef = useRef<string>("");

	return (
		<div className={styles.container}>
			<div className={styles.textBoxWithButtonContainer}>
				<TextBox svgIconName={props.svgIconName} placeholder={props.placeholder} maxLength={props.maxLength} disabled={props.disabled}
					onInput={onInput} onEditingEnded={onEditingEnded}/>

				<Button type={ButtonType.Secondary} square onClick={onSearch}>
					<SVG name="search"/>
				</Button>

				{
					props.children !== undefined && (Array.isArray(props.children) ? props.children.length > 0 : true) &&
						<>
							<span className={styles.searchResultsTouchObstackle}/>

							<div className={styles.searchResultsContainer}>
							{
								props.children
							}
							</div>
						</>
				}
			</div>

			{
				props.statusText !== undefined && props.statusText.length > 0 &&
					<p className={styles.statusText}>{props.statusText}</p>
			}
		</div>);
}