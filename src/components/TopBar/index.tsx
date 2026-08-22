import { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import styles from './TopBar.module.scss';
import { version as appVersion } from '../../../package.json';

import { SVG } from '../SVG';
import Button, { ButtonStyle } from '../Button';

import useTranslations from '../../hooks/useTranslations';
import { Id } from '../../hooks/useKanban';
import useTagsView from '../../hooks/useTagsView';

import { useGistAPIContext } from '../../context/GistAPIContext';

interface Props
{
	pageName?: string;
	boardId?: Id;
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const navigate = useNavigate();
	const { translate } = useTranslations();
	const { isOctokitInitialized, initOctokit, getGistContent, updateGist } = useGistAPIContext();
	const { openTagsView } = useTagsView();

	const onReturnToHome = () => navigate("/");

	return (
		<div className={`${styles.topBar} ${props.className ?? ''}`}>
			<div className={styles.leftContainer}>

				<div className={styles.logoContainer} onClick={onReturnToHome}>
					<SVG name="logo"/>

					<div className={styles.logoTextsContainer}>
						<h3 className={styles.appName}>Mitoru</h3>
						<p className={styles.subText}>v{appVersion} beta</p>
					</div>
				</div>

			{ props.pageName && <h5 className={styles.pageName}>{props.pageName}</h5> }

			{
				props.boardId !== undefined &&
					<Button className={styles.fitContentButton} buttonStyle={ButtonStyle.Outlined} small smallSVG
						onClick={() => props.boardId !== undefined ? openTagsView({ boardId: props.boardId }) : {}}>
						<SVG name="tag"/>
						{translate("board_tags")}
					</Button>
			}

				{/* <Button buttonStyle={ButtonStyle.Outlined} square onClick={initOctokit} disabled={isOctokitInitialized()}>initOctokit</Button>
				<Button buttonStyle={ButtonStyle.Outlined} square onClick={updateGist} disabled={!isOctokitInitialized()}>Push</Button>
				<Button buttonStyle={ButtonStyle.Outlined} square onClick={getGistContent} disabled={!isOctokitInitialized()}>Pull</Button> */}
			</div>

		{
			location.pathname !== "/settings" &&
				<Button className={styles.fitContentButton} buttonStyle={ButtonStyle.Outlined} small square
					onClick={() => navigate("/settings")}>
					<SVG name="settings"/>
				</Button>
		}

			{props.children}
		</div>
	);
}