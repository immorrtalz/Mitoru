import { useContext } from "react";
import { useNavigate } from "react-router";
import styles from "./Settings.module.scss";

import { SVG } from "../components/SVG";
import { Button, ButtonType } from "../components/Button";
import SettingsContext from '../context/SettingsContext';
import { TopBar } from "../components/TopBar";

import { settingTranslationKeys, settingOptions, Settings } from "../misc/settings";

import useTranslations from "../hooks/useTranslations";

function SettingsPage()
{
	const navigate = useNavigate();
	const { settings, setSettings } = useContext(SettingsContext);
	const { translate } = useTranslations();

	const getSettingOptions = (key: keyof Settings) =>
		settingOptions[key].map((value, index) => (
		{
			title: translate(settingTranslationKeys[key][index]),
			value
		}));

	const changeSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings({...settings, [key]: value});

	return (
		<div className={styles.page}>

			<TopBar>
				<Button type={ButtonType.Secondary} square onClick={() => navigate("/")}>
					<SVG name="chevronLeft"/>
				</Button>
				<p>{translate("settings")}</p>
			</TopBar>

			<div className={styles.mainContentContainer}>
			</div>
		</div>
	);
}

export default SettingsPage;