import { ReactElement, useContext } from 'react';
import styles from './TopBar.module.scss';
import { SVG } from '../SVG';
import { useNavigate } from 'react-router';
import BoardsContext from '../../context/BoardsContext';

interface Props
{
	pageName?: string;
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const navigate = useNavigate();
	const { setCurrentBoardId } = useContext(BoardsContext);

	const onReturnToHome = () =>
	{
		setCurrentBoardId(NaN);
		navigate("/");
	};

	return (
		<div className={`${styles.topBar} ${props.className ?? ''}`}>
			<div className={styles.leftContainer} onClick={onReturnToHome}>
				<div className={styles.logoContainer} onClick={onReturnToHome}>
					<SVG name="logo"/>
					<h5 className={styles.appName}>Mitoru</h5>
				</div>

				{ props.pageName && <h6 className={styles.pageName}>/{props.pageName}</h6> }
			</div>

			{props.children}
		</div>
	);
}