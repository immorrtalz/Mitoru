import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Settings.module.scss";

import { TopBar } from "../components/TopBar";
import Button, { ButtonStyle, ButtonVariant } from "../components/Button";
import { TextBox } from "../components/TextBox";

import useTranslations from "../hooks/useTranslations";
import useDialog from "../hooks/useDialog";

import { settingTranslationKeys, settingOptions, Settings } from "../misc/settings";
import { clearStoredToken, hasStoredToken } from "../misc/cryptoUtils";

import SettingsContext from '../context/SettingsContext';
import { useGistAPIContext } from "../context/GistAPIContext";

function SettingsPage()
{
	const navigate = useNavigate();
	const { settings, setSettings } = useContext(SettingsContext);
	const { translate } = useTranslations();
	const { initOctokit, createGist, getGistContent, updateGist } = useGistAPIContext();
	const { openPromptDialog } = useDialog();

	const onPassPhraseDialog = () =>
	{
		openPromptDialog(
		{
			title: "Enter the passphrase",
			description: `At least 8 characters long.\nThis will overwrite any existing API key and/or gist id in localStorage.`,
			validate: v => v.trim().length >= 8,
			onConfirm: result =>
			{
				initOctokit(result, githubAPIKeyValue === "" ? undefined : githubAPIKeyValue);
				setGithubAPIKeyValue("");
				setGistIdValue("");
			}
		});
	};

	const [githubAPIKeyValue, setGithubAPIKeyValue] = useState("");
	const [gistIdValue, setGistIdValue] = useState("");

	const getSettingOptions = (key: keyof Settings) =>
		settingOptions[key].map((value, index) => (
		{
			title: translate(settingTranslationKeys[key][index]),
			value
		}));

	const changeSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings({...settings, [key]: value});

	return (
		<div className='mainContainer'>

			<TopBar pageName={translate("settings")}/>

			<div className={styles.settingsPageContainer}>
				<div className={styles.settingsContentContainer}>
					<Button className={styles.backButton} buttonStyle={ButtonStyle.Outlined} small onClick={() => history.back()}>{translate("back")}</Button>

					<h2>{translate("settings")}</h2>

					<div className={styles.smallGapColumnContainer}>
						<p>This app uses localStorage to store your data.</p>
						<p>You can provide a GitHub API key to use GitHub Gists as the “cloud” data storage.</p>
						<p>You can use these types of tokens as an API key:</p>
						<ul>
							<li><a href="https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app" target="_blank" rel="noopener noreferrer">a GitHub App user access token</a></li>
							<li><a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token" target="_blank" rel="noopener noreferrer">a fine-grained personal access token with the `Gists` read and write permission</a></li>
						</ul>
						<p>You can provide a gist URL or id, if you'd like to use an existing one, but you need to own the gist and provide an API key to make changes to it.</p>
					</div>

					<div className={styles.smallGapColumnContainer}>
						<p>GitHub API key</p>
						<TextBox disabled
							value={githubAPIKeyValue}
							placeholder={hasStoredToken() ? "*********************************************************************************************" : ""}
							onInput={e =>
							{
								const inputValue = (e.target as HTMLInputElement).value.trim();
								setGithubAPIKeyValue(inputValue);
							}}/>
					</div>

					<div className={styles.smallGapColumnContainer}>
						<p>Gist URL or id</p>
						<TextBox disabled
							value={gistIdValue === "" ? undefined : gistIdValue}
							onInput={e =>
							{
								const inputValue = (e.target as HTMLInputElement).value.trim().toLowerCase().split("/").pop() || "";
								setGistIdValue(inputValue);
							}}/>
					</div>

					<Button buttonStyle={ButtonStyle.Outlined} disabled>Export kanban data</Button>

					<Button buttonStyle={ButtonStyle.Secondary} variant={ButtonVariant.Negative} onClick={() =>
					{
						setGithubAPIKeyValue("");
						setGistIdValue("");
						clearStoredToken();
					}}>
						Reset API key and gist id
					</Button>

					<Button buttonStyle={ButtonStyle.Primary}
						onClick={onPassPhraseDialog}
						disabled={githubAPIKeyValue === "" && gistIdValue === ""}>
						{translate("confirm")}
					</Button>

					<Button buttonStyle={ButtonStyle.Outlined} onClick={() => window.open("https://github.com/immorrtalz/Mitoru", "_blank")}>Source code on GitHub</Button>
				</div>
			</div>
		</div>
	);
}

export default SettingsPage;