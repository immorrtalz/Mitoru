import { useContext } from "react";
import { initialSettings, Locale, settingOptions, Settings } from "../../misc/settings";
import SettingsContext from "../../context/SettingsContext";

const SETTINGS_FILE_NAME = 'settings.json';

export default function useSettingsLoader()
{
	const { setSettings } = useContext(SettingsContext);

	const loadSettingsFromFile = async () =>
	{
		/* const settingsFileExists = await exists(SETTINGS_FILE_NAME, { baseDir: BaseDirectory.AppConfig });

		const readSettingsFile = async (): Promise<Settings> =>
		{
			try
			{
				const loadedSettingsContent = await readTextFile(SETTINGS_FILE_NAME, { baseDir: BaseDirectory.AppConfig });
				const loadedSettingsObject = JSON.parse(loadedSettingsContent);
				var loadedSettings: Settings = { ...initialSettings };
				const loadedKeys: string[] = [];
				const settingsCount = Object.keys(settingOptions).length;
				var loadedOptionsCount = 0;

				for (const [key, value] of Object.entries(loadedSettingsObject))
				{
					if (key in settingOptions && !(key in loadedKeys) && settingOptions[key as keyof Settings].includes(value as string))
					{
						(loadedSettings as any)[key] = value as string;
						loadedKeys.push(key);
						loadedOptionsCount++;
					}
				}

				if (loadedOptionsCount < settingsCount) await saveSettingsToFile(loadedSettings);
				return loadedSettings;
			}
			catch (e) { return initialSettings }
		};

		const getOSLocale = async (): Promise<Locale> =>
		{
			try
			{
				const osLocale = await locale();
				if (osLocale == null) return 'en';
				const osLocaleSliced = osLocale.slice(0, 2).toLowerCase();

				return settingOptions.locale.includes(osLocaleSliced) ? osLocaleSliced as Locale : 'en';
			}
			catch (e) { return 'en' }
		};

		// Set default settings and match locale to system's one on first load
		const osLocale = settingsFileExists ? null : await getOSLocale();
		const settingsToSave = settingsFileExists ? await readSettingsFile() : { ...initialSettings, locale: osLocale as Locale };

		setSettings(settingsToSave);
		if (!settingsFileExists) await saveSettingsToFile(settingsToSave); */

		return initialSettings;
	};

	const saveSettingsToFile = async (newSettings: Settings) => {}; // await writeTextFile(SETTINGS_FILE_NAME, JSON.stringify(newSettings), { baseDir: BaseDirectory.AppConfig });

	return { loadSettingsFromFile, saveSettingsToFile };
}