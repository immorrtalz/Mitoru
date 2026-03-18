import styles from './SearchBox.module.scss';

interface Props
{
	name: string;
	country?: string;
	admin1?: string;
	timezone?: string;
	disabled?: boolean;
	onClick?: (...args: any[]) => any;
}

export function SearchResultItem(props: Props)
{
	const onClick = (e: React.MouseEvent<HTMLElement>) =>
	{
		if (props.disabled !== true) props.onClick?.(e);
	};

	return (
		<div className={`${styles.searchResultItem} ${props.disabled ? styles.disabled : ''}`} onClick={onClick}>
			<div className={styles.nameContainer}>
				<p className={styles.name}>{props.name}</p>
				{ props.country && <p className={styles.country}>{props.country}{props.admin1 ? `, ${props.admin1}` : ''}</p> }
			</div>

			{ props.timezone && <p className={styles.timezone}>{props.timezone}</p> }
		</div>);
}