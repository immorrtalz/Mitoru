import { useLayoutEffect, useRef, useState } from 'react';
import { clamp, CSSPropertiesWithVars } from '../../misc/utils';
import styles from './ContextMenu.module.scss';

const VIEWPORT_MARGIN = 8;

interface Props
{
	position: { top: number; left: number; };
	onCancel?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
}

export default function ContextMenu(props: Props)
{
	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	const contextMenuRef = useRef<HTMLDivElement>(null);
	const [styleObject, setStyleObject] = useState<CSSPropertiesWithVars | undefined>(undefined);

	useLayoutEffect(() =>
	{
		const contextMenuRect = contextMenuRef.current?.getBoundingClientRect();

		const maxTop = window.innerHeight - (contextMenuRect?.height ?? 0) - VIEWPORT_MARGIN;
		const maxLeft = window.innerWidth - (contextMenuRect?.width ?? 0) - VIEWPORT_MARGIN;

		setStyleObject(
		{
			top: `${clamp(props.position.top, VIEWPORT_MARGIN, maxTop)}px`,
			left: `${clamp(props.position.left, VIEWPORT_MARGIN, maxLeft)}px`
		} as CSSPropertiesWithVars);
	}, []);

	return (
		<>
			<span className={styles.overlay} onClick={onCancel}/>

			<div className={`${styles.container} ${props.className || ''}`} style={styleObject ?? {}} ref={contextMenuRef}>
				{props.children}
			</div>
		</>
	);
}