import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Settings.module.scss";

import Button, { ButtonType } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { TextBox } from "../components/TextBox";

import SettingsContext from '../context/SettingsContext';
import { settingTranslationKeys, settingOptions, Settings } from "../misc/settings";

import useTranslations from "../hooks/useTranslations";
import DialogWindow from "../components/DialogWindow";
import { clearStoredToken, hasStoredToken } from "../misc/cryptoUtils";
import { useGistAPIContext } from "../context/GistAPIContext";

function SettingsPage()
{
	const navigate = useNavigate();
	const { settings, setSettings } = useContext(SettingsContext);
	const { translate } = useTranslations();
	const { initOctokit, createGist, getGistContent, updateGist } = useGistAPIContext();

	const [passPhraseDialogOpen, setPassPhraseDialogOpen] = useState(false);
	const [passPhraseValue, setPassPhraseValue] = useState("");
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
					<Button className={styles.backButton} type={ButtonType.Secondary} small onClick={() => history.back()}>Back</Button>

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
						<TextBox
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
						<TextBox
							value={gistIdValue === "" ? undefined : gistIdValue}
							onInput={e =>
							{
								const inputValue = (e.target as HTMLInputElement).value.trim().toLowerCase().split("/").pop() || "";
								setGistIdValue(inputValue);
							}}/>
					</div>

					<Button type={ButtonType.Secondary}>Export kanban data</Button>

					<Button type={ButtonType.Negative} onClick={() =>
					{
						setGithubAPIKeyValue("");
						setGistIdValue("");
						clearStoredToken();
					}}>
						Reset API key and gist id
					</Button>

					<Button type={ButtonType.Primary}
						onClick={() => setPassPhraseDialogOpen(true)}
						disabled={githubAPIKeyValue === "" && gistIdValue === ""}>
						Confirm
					</Button>
				</div>
			</div>

		{
			passPhraseDialogOpen && <DialogWindow
				title="Enter the passphrase"
				description={`At least 8 characters long.\nThis will overwrite any existing API key and/or gist id in localStorage.`}
				onCancel={() =>
				{
					setPassPhraseValue("");
					setPassPhraseDialogOpen(false);
				}}
				confirmDisabled={passPhraseValue.length < 8}
				onConfirm={() =>
				{
					initOctokit(passPhraseValue, githubAPIKeyValue === "" ? undefined : githubAPIKeyValue);
					setPassPhraseValue("");
					setPassPhraseDialogOpen(false);
					setGithubAPIKeyValue("");
					setGistIdValue("");
				}}>

					<TextBox
						value={passPhraseValue}
						minLength={8}
						maxLength={256}
						onInput={e => setPassPhraseValue((e.target as HTMLInputElement).value)}
						autofocus/>
			</DialogWindow>
		}
		</div>
	);
}

export default SettingsPage;