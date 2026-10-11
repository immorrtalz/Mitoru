import { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './TopBar.module.scss';
import { version as appVersion } from '../../../package.json';

import { SVG } from '../SVG';
import Button from '../Button';

import useTranslations, { TranslationKey } from '../../hooks/useTranslations';
import useTagsView from '../../hooks/useTagsView';
import useBoardFromRoute from '../../hooks/useBoardFromRoute';

import { InteractableStyle } from '../../misc/utils';

interface Props
{
	children?: ReactElement | ReactElement[];
	className?: string;
}

export function TopBar(props: Props)
{
	const navigate = useNavigate();
	const { translate } = useTranslations();
	const { openTagsView } = useTagsView();
	const { boardId, board } = useBoardFromRoute();
	const location = useLocation();

	const pageName = board?.title ?? translate(location.pathname.split('/').pop() as TranslationKey);

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

			{ pageName.trim() !== "" && <h5 className={styles.pageName}>{pageName}</h5> }

			{
				boardId !== undefined &&
					<Button className={styles.fitContentButton} buttonStyle={InteractableStyle.Outlined} small smallSVG
						onClick={() => boardId !== undefined ? openTagsView({ boardId: boardId }) : {}}>
						<SVG name="tag"/>
						{translate("board_tags")}
					</Button>
			}
			</div>

			{props.children}

			<div className={styles.rightContainer}>
			{
				location.pathname !== "/settings" &&
					<Button className={styles.fitContentButton} buttonStyle={InteractableStyle.Outlined} small square
						onClick={() => navigate("/settings")}>
						<SVG name="settings"/>
					</Button>
			}
			</div>
		</div>
	);
}