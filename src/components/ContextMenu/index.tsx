import { useLayoutEffect, useRef, useState } from 'react';
import { clamp, CSSPropertiesWithVars } from '../../misc/utils';
import styles from './ContextMenu.module.scss';
import BackgroundOverlay from '../BackgroundOverlay';

const VIEWPORT_MARGIN = 8;
const DEFAULT_WIDTH = 210;

interface Props
{
	position: { top: number; left: number; };
	width?: number | "fit-content";
	maxWidth?: string;
	showBackgroundOverlay?: boolean;
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
		const contextMenuElement = contextMenuRef.current;
		if (!contextMenuElement) return;

		const width = (typeof props.width === "number") ? `${props.width}px` : props.width ?? `${DEFAULT_WIDTH}px`;
		const maxWidth = props.maxWidth ?? "";
		contextMenuElement.style.width = width;
		contextMenuElement.style.maxWidth = maxWidth;

		const contextMenuRect = contextMenuElement.getBoundingClientRect();
		const maxTop = window.innerHeight - contextMenuRect.height - VIEWPORT_MARGIN;
		const maxLeft = window.innerWidth - contextMenuRect.width - VIEWPORT_MARGIN;

		setStyleObject(
		{
			width,
			maxWidth,
			top: `${clamp(props.position.top, VIEWPORT_MARGIN, maxTop)}px`,
			left: `${clamp(props.position.left, VIEWPORT_MARGIN, maxLeft)}px`
		} as CSSPropertiesWithVars);
	}, []);

	return (
		<>
			<BackgroundOverlay {...props.showBackgroundOverlay !== true ? { transparent: true } : {}} onClick={onCancel}/>

			<div className={`${styles.container} ${props.className || ''}`} style={styleObject ?? {}} ref={contextMenuRef}>
				{props.children}
			</div>
		</>
	);
}