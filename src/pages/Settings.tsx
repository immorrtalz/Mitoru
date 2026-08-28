import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Settings.module.scss";

import { TopBar } from "../components/TopBar";
import Button from "../components/Button";
import { TextBox } from "../components/TextBox";

import useSettingsLoader from "../hooks/useSettingsLoader";
import useTranslations, { TranslationKey } from "../hooks/useTranslations";
import useDialog from "../hooks/useDialog";
import useContextMenu from "../hooks/useContextMenu";
import { isValidKanbanState, KanbanState } from "../hooks/useKanban";

import { Locale, LOCALES, Settings } from "../misc/settings";
import { HorizontalAlign, InteractableStyle, StyleVariant } from "../misc/utils";
import { clearStoredToken, hasStoredToken } from "../misc/cryptoUtils";

import SettingsContext from '../context/SettingsContext';
import { useBoardsContext } from "../context/BoardsContext";
import { useGistAPIContext } from "../context/GistAPIContext";

const JSON_DATA_FILE_NAME = "mitoru_data";

function SettingsPage()
{
	const navigate = useNavigate();
	const { settings, setSettings } = useContext(SettingsContext);
	const { saveSettings } = useSettingsLoader(setSettings);
	const { translate } = useTranslations();
	const { state, loadState } = useBoardsContext();
	const { openContextMenu } = useContextMenu();
	const { initOctokit, createGist, getGistContent, updateGist } = useGistAPIContext();
	const { openPromptDialog } = useDialog();

	const JSONFileInputRef = useRef<HTMLInputElement>(null);

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

	const changeSetting = <K extends keyof Settings>(key: K, value: Settings[K]) =>
	{
		setSettings({...settings, [key]: value});
		saveSettings({...settings, [key]: value});
	};

	const onImportJSONData = async () => JSONFileInputRef.current?.click();

	const onImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>, onStateParsed: (state: KanbanState) => void) =>
	{
		const file = e.target.files?.[0];
		if (file === undefined) return;

		const reader = new FileReader();

		reader.onload = () =>
		{
			try
			{
				const parsedObject = JSON.parse(reader.result as string);

				if (isValidKanbanState(parsedObject)) onStateParsed(parsedObject);
				else console.error('Invalid file');
			}
			catch (e) { console.error('Failed to import file:', e); }
		};

		reader.readAsText(file);
		e.target.value = ''; // Allow selecting the same file again later
	}

	const onExportJSONData = async () =>
	{
		const jsonData = JSON.stringify(state, null, 3);
		const blob = new Blob([jsonData], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `${JSON_DATA_FILE_NAME}_${new Date().toISOString().slice(0, 10)}.json`;
		a.click();

		URL.revokeObjectURL(url);
	};

	const onLocaleContextMenu = (triggerButtonRect: DOMRect) =>
	{
		openContextMenu(
		{
			children: (
				LOCALES.map((value, index) =>
					<Button key={`locale-${value}-${index}`} buttonStyle={InteractableStyle.Ghost} align={HorizontalAlign.Left} small smallSVG dimmedSVG
						onClick={() => changeSetting("locale", value as Locale)}>
						{translate(`setting_locale_${value.replace("-", "_").toLowerCase()}` as TranslationKey)}
					</Button>)
			),
			position: { top: triggerButtonRect.bottom, left: triggerButtonRect.left }
		});
	};

	return (
		<div className='mainContainer'>

			<TopBar pageName={translate("settings")}/>

			<div className={styles.settingsPageContainer}>
				<div className={styles.settingsContentContainer}>
					<Button className={styles.backButton} buttonStyle={InteractableStyle.Outlined} small onClick={() => navigate("/")}>{translate("go_home")}</Button>

					<h2>{translate("settings")}</h2>

					<div className={`${styles.smallGapRowContainer} ${styles.justifyContentSpaceBetween} ${styles.alignItemsCenter}`}>
						<p>{translate("language")}</p>

						<Button buttonStyle={InteractableStyle.Outlined} small onClick={e => onLocaleContextMenu(e.currentTarget.getBoundingClientRect())}>
							{translate(`setting_locale_${settings.locale.replace("-", "_").toLowerCase()}` as TranslationKey)}
						</Button>
					</div>

					<div className={styles.smallGapColumnContainer}>
						<p>{`${translate("import")}/${translate("export")} ${translate("json_data")}`}</p>

						<div className={`${styles.smallGapRowContainer} ${styles.justifyContentSpaceBetween} ${styles.flexGrowChildren} ${styles.flexShrinkChildren}`}>
							<Button buttonStyle={InteractableStyle.Outlined} onClick={onImportJSONData}>
								{`${translate("import")} ${translate("json_data")}`}
							</Button>

							<input type="file"
								accept="application/json"
								ref={JSONFileInputRef}
								style={{ display: 'none' }}
								onChange={e => onImportFileSelected(e, loadState)}/>

							<Button buttonStyle={InteractableStyle.Outlined} onClick={onExportJSONData}>
								{`${translate("export")} ${translate("json_data")}`}
							</Button>
						</div>
					</div>

					<div className={styles.smallGapColumnContainer}>
						<h4 className={styles.marginBottomForHeader}>{translate("github_gists_integration")}</h4>

						<p>{translate("this_app_uses_localstorage")}</p>
						<p>{translate("you_can_provide_a_github_api_key")}</p>
						<p>{translate("you_can_use_these_types_of_tokens")}</p>
						<ul>
							<li><a href="https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app" target="_blank" rel="noopener noreferrer">{translate("a_github_app_user_access_token")}</a></li>
							<li><a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token" target="_blank" rel="noopener noreferrer">{translate("a_fine_grained_personal_access_token_with_the_gists_read_and_write_permission")}</a></li>
						</ul>
						<p>{translate("you_can_provide_a_gist_url_or_id")}</p>

						<br/>

						<p>GitHub API key</p>
						<TextBox disabled
							textBoxStyle={InteractableStyle.Outlined}
							value={githubAPIKeyValue}
							placeholder={hasStoredToken() ? "*********************************************************************************************" : ""}
							onInput={e =>
							{
								const inputValue = (e.target as HTMLInputElement).value.trim();
								setGithubAPIKeyValue(inputValue);
							}}/>

						<br/>

						<p>Gist URL or id</p>
						<TextBox disabled
							textBoxStyle={InteractableStyle.Outlined}
							value={gistIdValue === "" ? undefined : gistIdValue}
							onInput={e =>
							{
								const inputValue = (e.target as HTMLInputElement).value.trim().toLowerCase().split("/").pop() || "";
								setGistIdValue(inputValue);
							}}/>
					</div>

					<Button buttonStyle={InteractableStyle.Secondary} variant={StyleVariant.Negative} onClick={() =>
					{
						setGithubAPIKeyValue("");
						setGistIdValue("");
						clearStoredToken();
					}}>
						Reset API key and gist id
					</Button>

					<Button buttonStyle={InteractableStyle.Primary}
						onClick={onPassPhraseDialog}
						disabled={githubAPIKeyValue === "" && gistIdValue === ""}>
						{translate("confirm")}
					</Button>

					<Button buttonStyle={InteractableStyle.Outlined} onClick={() => window.open("https://github.com/immorrtalz/Mitoru", "_blank")}>Source code on GitHub</Button>
				</div>
			</div>
		</div>
	);
}

export default SettingsPage;