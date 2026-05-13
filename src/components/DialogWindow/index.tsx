import Button, { ButtonType } from '../Button';
import styles from './DialogWindow.module.scss';
import useTranslations from "../../hooks/useTranslations";

interface Props
{
	title: string;
	description: string;
	cancelTitle?: string;
	cancelDisabled?: boolean;
	cancelType?: ButtonType;
	confirmTitle?: string;
	confirmDisabled?: boolean;
	confirmType?: ButtonType;
	onCancel?: (...args: any[]) => any;
	onConfirm?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
	canBackdropCancel?: boolean;
}

export default function DialogWindow(props: Props)
{
	const { translate } = useTranslations();

	const onConfirm = (e: React.MouseEvent<HTMLElement>) => props.onConfirm?.(e);
	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	return (
		<>
			<span className={styles.overlay} onClick={props.canBackdropCancel !== false ? onCancel : undefined}/>

			<div className={`${styles.container} ${props.className || ''}`}>
				<h5 className={styles.title}>{props.title}</h5>
				<p className={styles.description}>{props.description}</p>

				{props.children}

				<div className={styles.buttonsContainer}>
					{ props.onCancel && <Button type={props.cancelType || ButtonType.Secondary} onClick={onCancel}>{props.cancelTitle || translate('cancel')}</Button> }
					{
						props.onConfirm &&
						<Button type={props.confirmType || ButtonType.Primary} onClick={onConfirm} disabled={props.confirmDisabled}>
							{props.confirmTitle || translate('confirm')}
						</Button>
					}
				</div>
			</div>
		</>
	);
}