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
	maxHeight?: string;
	showBackgroundOverlay?: boolean;
	onCancel?: (...args: any[]) => any;
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
}

export default function ContextMenu(props: Props)
{
	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	const contextMenuRef = useRef<HTMLDivElement>(null);
	const glideBackgroundRef = useRef<HTMLSpanElement>(null);
	const glideBackgroundTimeoutRef = useRef<number>(null);
	const [styleObject, setStyleObject] = useState<CSSPropertiesWithVars | undefined>(undefined);

	useLayoutEffect(() =>
	{
		const contextMenuElement = contextMenuRef.current;
		if (!contextMenuElement) return;

		const width = (typeof props.width === "number") ? `${props.width}px` : props.width ?? `${DEFAULT_WIDTH}px`;
		const maxWidth = props.maxWidth ?? "";
		const maxHeight = props.maxHeight ?? "";
		contextMenuElement.style.width = width;
		contextMenuElement.style.maxWidth = maxWidth;
		contextMenuElement.style.maxHeight = maxHeight;

		const contextMenuRect = contextMenuElement.getBoundingClientRect();
		const maxTop = window.innerHeight - contextMenuRect.height - VIEWPORT_MARGIN;
		const maxLeft = window.innerWidth - contextMenuRect.width - VIEWPORT_MARGIN;

		setStyleObject(
		{
			width,
			maxWidth,
			maxHeight,
			top: `${clamp(props.position.top, VIEWPORT_MARGIN, maxTop)}px`,
			left: `${clamp(props.position.left, VIEWPORT_MARGIN, maxLeft)}px`
		} as CSSPropertiesWithVars);
	}, []);

	const onPointerOverItem = (e: React.PointerEvent<HTMLDivElement>) =>
	{
		const targetElement = (e.target as HTMLElement).closest('button');
		const containerElement = contextMenuRef.current;
		const glideBackgroundElement = glideBackgroundRef.current;
		if (!targetElement || !containerElement || !glideBackgroundElement || targetElement.disabled) return;

		const containerRect = containerElement.getBoundingClientRect();
		const targetRect = targetElement.getBoundingClientRect();

		if (glideBackgroundTimeoutRef.current !== null)
			clearTimeout(glideBackgroundTimeoutRef.current);

		glideBackgroundTimeoutRef.current = setTimeout(() =>
		{
			glideBackgroundElement.style.opacity = '0';
			glideBackgroundTimeoutRef.current = null;
		}, 100);

		glideBackgroundElement.style.opacity = '1';
		glideBackgroundElement.style.width = `${targetRect.width}px`;
		glideBackgroundElement.style.height = `${targetRect.height}px`;
		glideBackgroundElement.style.borderRadius = getComputedStyle(targetElement).borderRadius;
		glideBackgroundElement.style.transform = `translate(${targetRect.left - containerRect.left - containerElement.clientLeft}px, ${targetRect.top - containerRect.top - containerElement.clientTop + containerElement.scrollTop}px)`;
	};

	const onPointerLeaveMenu = () =>
	{
		const glideBackground = glideBackgroundRef.current;
		if (!glideBackground) return;

		glideBackground.style.opacity = '0';
	};

	return (
		<>
			<BackgroundOverlay {...props.showBackgroundOverlay !== true ? { transparent: true } : {}} onClick={onCancel}/>

			<div className={`${styles.container} ${props.className || ''}`} style={styleObject ?? {}} ref={contextMenuRef} onPointerOver={onPointerOverItem} onPointerLeave={onPointerLeaveMenu}>
				<span className={styles.glideSelectBackground} ref={glideBackgroundRef}/>
				{props.children}
			</div>
		</>
	);
}