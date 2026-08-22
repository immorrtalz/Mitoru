import styles from './BackgroundOverlay.module.scss';

interface Props
{
	className?: string;
	onClick?: (...args: any[]) => any;
}

export default function BackgroundOverlay(props: Props)
{
	return <span className={`${styles.overlay} ${props.className || ''}`} onClick={props.onClick}/>;
}