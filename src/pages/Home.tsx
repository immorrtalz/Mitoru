import { useContext } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

import { SVG } from "../components/SVG";
import { Button, ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";

import useTranslations from "../hooks/useTranslations";
import SettingsContext from "../context/SettingsContext";

function Home()
{
	const navigate = useNavigate();
	const { settings } = useContext(SettingsContext);
	const { translate } = useTranslations();

	return (
		<div className={styles.page}>

			<TopBar>
				<Button type={ButtonType.Secondary} square onClick={() => navigate("/settings")}>
					<SVG name="settings"/>
				</Button>
			</TopBar>

		</div>
	);
}

export default Home;