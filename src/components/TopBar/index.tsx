import { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import styles from './TopBar.module.scss';

import { SVG } from '../SVG';
import Button, { ButtonStyle } from '../Button';

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

			<Button buttonStyle={ButtonStyle.Outlined} square onClick={initOctokit} disabled={isOctokitInitialized()}>initOctokit</Button>
			<Button buttonStyle={ButtonStyle.Outlined} square onClick={updateGist} disabled={!isOctokitInitialized()}>Push</Button>
			<Button buttonStyle={ButtonStyle.Outlined} square onClick={getGistContent} disabled={!isOctokitInitialized()}>Pull</Button>
			</div>

			{
				location.pathname !== "/settings" &&
					<Button buttonStyle={ButtonStyle.Outlined} square onClick={() => navigate("/settings")}>
						<SVG name="settings"/>
					</Button>
			}

			{props.children}
		</div>
	);
}