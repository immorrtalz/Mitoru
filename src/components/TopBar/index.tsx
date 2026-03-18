import { ReactElement, useEffect, useRef } from 'react';
import styles from './TopBar.module.scss';

interface Props
{
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const topBarRef = useRef<HTMLDivElement | null>(null);

	const onPageScroll = () =>
	{
		if (topBarRef.current !== null)
		{
			if (document.documentElement.scrollTop > 0) topBarRef.current.classList.add(styles.scrolledTopBar);
			else topBarRef.current.classList.remove(styles.scrolledTopBar);
		}
	};

	useEffect(() =>
	{
		onPageScroll();

		document.addEventListener("scroll", onPageScroll);
		return () => document.removeEventListener("scroll", onPageScroll);
	}, []);

	return (
		<div className={`${styles.topBar} ${props.className ?? ''}`} ref={topBarRef}>
			{props.children}
		</div>
	);
}