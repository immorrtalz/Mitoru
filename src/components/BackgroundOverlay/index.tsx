import styles from './BackgroundOverlay.module.scss';

interface Props
{
	className?: string;
	transparent?: boolean;
	onClick?: (...args: any[]) => any;
}

export default function BackgroundOverlay(props: Props)
{
	return <span className={`${styles.overlay} ${props.transparent === true ? styles.transparent : ''} ${props.className || ''}`} onClick={props.onClick}/>;
}