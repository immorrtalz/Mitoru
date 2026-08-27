import { useContext } from "react";
import { initialSettings, Locale, LOCALES, Settings } from "../misc/settings";
import SettingsContext from "../context/SettingsContext";

const SETTINGS_STORAGE_KEY = 'settings';

export default function useSettingsLoader()
{
	const { setSettings } = useContext(SettingsContext);

	const loadSettings = async () =>
	{
		const settingsFromLocalStorage = localStorage.getItem(SETTINGS_STORAGE_KEY);
		const settingsExistInLocalStorage = settingsFromLocalStorage !== null;

		const loadSettingsFromLocalStorage = async (): Promise<Settings> =>
		{
			try
			{
				if (!settingsExistInLocalStorage) return initialSettings;

				const loadedSettingsObject = JSON.parse(settingsFromLocalStorage);
				// Match locale with system on the first app launch
				let loadedSettings: Settings = { ...initialSettings, ...loadedSettingsObject, locale: loadedSettingsObject.locale ?? await getOSLocale() };

				for (const [key, _] of Object.entries(loadedSettingsObject))
				{
					if (!(key in initialSettings))
						delete (loadedSettings as any)[key];
				}

				return loadedSettings;
			}
			catch (e) { return initialSettings }
		};

		const getOSLocale = async (): Promise<Locale> =>
		{
			try
			{
				const osLocale = navigator.language || (navigator.languages && navigator.languages[0]) || initialSettings.locale;
				if (osLocale == null) return initialSettings.locale;
				const osLocaleSliced = osLocale.slice(0, 2).toLowerCase();

				return (LOCALES as readonly string[]).includes(osLocaleSliced) ? osLocaleSliced as Locale : initialSettings.locale;
			}
			catch (e) { return initialSettings.locale }
		};

		const settingsToSet = await loadSettingsFromLocalStorage();
		setSettings(settingsToSet);
		if (settingsExistInLocalStorage === false) await saveSettings(settingsToSet);

		return settingsToSet;
	};

	const saveSettings = async (newSettings: Settings) =>
		localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));

	return { loadSettings, saveSettings };
}