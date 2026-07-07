import { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import styles from './TopBar.module.scss';

import { SVG } from '../SVG';
import Button, { ButtonType } from '../Button';

import { useGistAPIContext } from '../../context/GistAPIContext';

interface Props
{
	pageName?: string;
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const navigate = useNavigate();
	const { isOctokitInitialized, initOctokit, getGistContent, updateGist } = useGistAPIContext();

	const onReturnToHome = () => navigate("/");

	return (
		<div className={`${styles.topBar} ${props.className ?? ''}`}>
			<div className={styles.leftContainer}>
				<div className={styles.logoContainer} onClick={onReturnToHome}>
					<SVG name="logo"/>
					<h3 className={styles.appName}>Mitoru</h3>
				</div>

			{ props.pageName && <h5>{props.pageName}</h5> }

			<Button type={ButtonType.Secondary} square onClick={initOctokit} disabled={isOctokitInitialized()}>initOctokit</Button>
			<Button type={ButtonType.Secondary} square onClick={updateGist} disabled={!isOctokitInitialized()}>Push</Button>
			<Button type={ButtonType.Secondary} square onClick={getGistContent} disabled={!isOctokitInitialized()}>Pull</Button>
			</div>

			<Button type={ButtonType.Secondary} square onClick={() => window.open("https://github.com/immorrtalz/Mitoru", "_blank")}>GitHub</Button>

			{
				location.pathname !== "/settings" &&
					<Button type={ButtonType.Secondary} square onClick={() => navigate("/settings")}>
						<SVG name="settings"/>
					</Button>
			}

			{props.children}
		</div>
	);
}