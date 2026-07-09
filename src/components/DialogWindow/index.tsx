import Button, { ButtonStyle, ButtonVariant } from '../Button';
import styles from './DialogWindow.module.scss';
import useTranslations from "../../hooks/useTranslations";

interface Props
{
	title: string;
	description: string;
	cancelTitle?: string;
	cancelDisabled?: boolean;
	cancelButtonStyle?: ButtonStyle;
	cancelButtonVariant?: ButtonVariant;
	confirmTitle?: string;
	confirmDisabled?: boolean;
	confirmButtonStyle?: ButtonStyle;
	confirmButtonVariant?: ButtonVariant;
	onCancel?: (...args: any[]) => any;
	onConfirm?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
	canBackdropCancel?: boolean;
}

export default function DialogWindow(props: Props)
{
	const { translate } = useTranslations();

	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);
	const onConfirm = (e: React.MouseEvent<HTMLElement>) => props.onConfirm?.(e);

	return (
		<>
			<span className={styles.overlay} onClick={props.canBackdropCancel !== false ? onCancel : undefined}/>

			<div className={`${styles.container} ${props.className || ''}`}>
				<h5 className={styles.title}>{props.title}</h5>
				<p className={styles.description}>{props.description}</p>

				{props.children}

				<div className={styles.buttonsContainer}>
					{ props.onCancel && <Button buttonStyle={props.cancelButtonStyle ?? ButtonStyle.Outlined} variant={props.cancelButtonVariant ?? ButtonVariant.Neutral} onClick={onCancel}>{props.cancelTitle ?? translate('cancel')}</Button> }
					{
						props.onConfirm &&
						<Button buttonStyle={props.confirmButtonStyle ?? ButtonStyle.Primary} variant={props.confirmButtonVariant ?? ButtonVariant.Neutral} onClick={onConfirm} disabled={props.confirmDisabled}>
							{props.confirmTitle ?? translate('confirm')}
						</Button>
					}
				</div>
			</div>
		</>
	);
}