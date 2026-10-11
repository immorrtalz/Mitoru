import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./Settings.module.scss";

import Button from "../components/Button";

import useSettingsLoader from "../hooks/useSettingsLoader";
import useTranslations, { TranslationKey } from "../hooks/useTranslations";
import useDialog from "../hooks/useDialog";
import useContextMenu from "../hooks/useContextMenu";
import { isValidKanbanState, KanbanState } from "../hooks/useKanban";

import { Locale, LOCALES, Settings } from "../misc/settings";
import { HorizontalAlign, InteractableStyle, StyleVariant } from "../misc/utils";

import SettingsContext from '../context/SettingsContext';
import { useBoardsContext } from "../context/BoardsContext";

const JSON_DATA_FILE_NAME = "mitoru_data";

const JSON_DATA_FILE_NAME = "mitoru_data";

function SettingsPage()
{
	const navigate = useNavigate();
	const { settings, setSettings } = useContext(SettingsContext);
	const { saveSettings } = useSettingsLoader(setSettings);
	const { translate } = useTranslations();
	const { state, loadState } = useBoardsContext();
	const { openContextMenu } = useContextMenu();
	const { openDialog } = useDialog();

	const JSONFileInputRef = useRef<HTMLInputElement>(null);

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

				if (isValidKanbanState(parsedObject))
				{
					openDialog(
					{
						title: `${translate("are_you_sure_import_data_from")} ${new Date(parsedObject.savedAt).toLocaleString()}?`,
						description: `${translate("importing_will_overwrite_current_data")}.\n${translate("this_action_cannot_be_undone")}.`,
						onConfirm: () => onStateParsed(parsedObject)
					});
				}
				else
				{
					openDialog(
					{
						title: `${translate("invalid_or_corrupted_file")}`,
						description: `${translate("this_data_cannot_be_imported_invalid")}.`,
						cancelShown: false,
						confirmButtonVariant: StyleVariant.Negative
					});
				}
			}
			catch (e)
			{
				openDialog(
				{
					title: `${translate("failed_to_import_file")}`,
					description: `${translate("unknown_error_occured")}.\n${(e as Error).message}`,
					cancelShown: false,
					confirmButtonVariant: StyleVariant.Negative
				});
			}
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
			<div className={styles.settingsPageContainer}>
				<div className={styles.settingsContentContainer}>
					<Button className={styles.backButton} buttonStyle={InteractableStyle.Outlined} small onClick={() => navigate("/")}>{translate("go_to_home")}</Button>

					<h2 className="grayGradientText">{translate("settings")}</h2>

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

					<Button buttonStyle={InteractableStyle.Outlined} onClick={() => window.open("https://github.com/immorrtalz/Mitoru", "_blank")}>Source code on GitHub</Button>
				</div>
			</div>
		</div>
	);
}

export default SettingsPage;