import { ReactElement } from 'react';
import styles from './TopBar.module.scss';
import { SVG } from '../SVG';
import { useNavigate } from 'react-router';

interface Props
{
	pageName?: string;
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const navigate = useNavigate();

	return (
		<div className={`${styles.topBar} ${props.className ?? ''}`}>
			<div className={styles.leftContainer} onClick={() => navigate("/")}>
				<div className={styles.logoContainer} onClick={() => navigate("/")}>
					<SVG name="logo"/>
					<h5 className={styles.appName}>Mitoru</h5>
				</div>

				{ props.pageName && <h5 className={styles.pageName}>/{props.pageName}</h5> }
			</div>

			{props.children}
		</div>
	);
}