import { useEffect, useState } from 'react';
import styles from './Dropdown.module.scss';
import { SVG } from '../SVG';

export interface DropdownOption
{
	title: string;
	value: string;
}

interface Props
{
	options: DropdownOption[];
	defaultOptionIndex?: number;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
	onOptionClick?: (...args: any[]) => any;
}

export function Dropdown(props: Props)
{
	if (props.options.length == 0) return (<></>);

	const [currentOptionIndex, setCurrentOptionIndex] = useState(props.defaultOptionIndex ?? 0);
	const [isOpen, setIsOpen] = useState(false);

	function onClick(_e: React.MouseEvent<HTMLElement> | null = null)
	{
		setIsOpen(!isOpen);
		props.onClick?.();
	};

	function onOptionClick(e: React.MouseEvent<HTMLElement>)
	{
		e.stopPropagation();
		const target = e.target as HTMLElement;

		setCurrentOptionIndex(Array.from(target.parentElement!.children).indexOf(target));
		onClick();
	};

	useEffect(() => props.disabled ? undefined : props.onOptionClick?.(props.options[currentOptionIndex].value), [currentOptionIndex]);

	return (
		<>
			{ isOpen && <span className={styles.optionsBg} onClick={onClick}/> }

			<div className={`${styles.dropdown} ${props.disabled ? styles.disabled : ''} ${isOpen ? styles.open : ''}`}
				onClick={props.disabled ? undefined : onClick}>
				<p className={styles.currentValueTitle}>{props.options[currentOptionIndex].title}</p>
				<SVG name="chevronDown"/>
			</div>

			{ isOpen &&
					<div className={styles.options} onClick={e => e.stopPropagation()}>
					{
						props.options.map((option, index) =>
							<div key={`${option.title}-${option.value}-${index}`}
								className={`${styles.option} ${index == currentOptionIndex ? styles.current : ''}`}
								onClick={props.disabled ? undefined : onOptionClick}>
								<p className={styles.optionTitle}>{option.title}</p>
							</div>)
					}
					</div>
			}
		</>
	);
}