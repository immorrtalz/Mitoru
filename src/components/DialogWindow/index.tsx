import Button from '../Button';
import styles from './DialogWindow.module.scss';
import useTranslations from "../../hooks/useTranslations";
import { InteractableStyle, StyleVariant } from '../../misc/utils';

interface Props
{
	title: string;
	description: string;
	cancelTitle?: string;
	cancelShown?: boolean;
	cancelDisabled?: boolean;
	cancelButtonStyle?: InteractableStyle;
	cancelButtonVariant?: StyleVariant;
	confirmTitle?: string;
	confirmShown?: boolean;
	confirmDisabled?: boolean;
	confirmButtonStyle?: InteractableStyle;
	confirmButtonVariant?: StyleVariant;
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
				{
					props.cancelShown !== false && props.onCancel &&
						<Button buttonStyle={props.cancelButtonStyle ?? InteractableStyle.Outlined}
							variant={props.cancelButtonVariant ?? StyleVariant.Neutral}
							onClick={onCancel} disabled={props.cancelDisabled}>
							{props.cancelTitle ?? translate('cancel')}</Button>
				}
				{
					props.confirmShown !== false && props.onConfirm &&
						<Button buttonStyle={props.confirmButtonStyle ?? InteractableStyle.Primary}
							variant={props.confirmButtonVariant ?? StyleVariant.Neutral}
							onClick={onConfirm} disabled={props.confirmDisabled}>
							{props.confirmTitle ?? translate('confirm')}
						</Button>
				}
				</div>
			</div>
		</>
	);
}